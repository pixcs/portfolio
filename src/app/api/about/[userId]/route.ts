import { NextRequest, NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import mongoose from "mongoose";
import { connectToDB } from "@/app/lib/connectToDB";
import { AboutMeModel } from "@/app/models/models";

type Params = { params: { userId: string } };

export async function GET(_req: NextRequest, { params }: Params) {
    try {
        await connectToDB();

        if (!mongoose.isValidObjectId(params.userId)) {
            return NextResponse.json({ error: "Invalid user ID." }, { status: 400 });
        }

        const about = await AboutMeModel.findOne({
            userId: new mongoose.Types.ObjectId(params.userId),
        }).lean();

        if (!about) {
            return NextResponse.json({ error: "About Me not found." }, { status: 404 });
        }

        return NextResponse.json({ about }, { status: 200 });
    } catch (err) {
        console.error("[GET /api/about]", err);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: Params) {
    try {
        await connectToDB();

        if (!mongoose.isValidObjectId(params.userId)) {
            return NextResponse.json({ error: "Invalid user ID." }, { status: 400 });
        }

        const body = await req.json();

        const {
            heading,
            paragraphs,
            quickFacts,
            profileImages,
            profileImagePathnames,
            removedPathnames
        } = body;

        const aboutMeToken = process.env.BLOB_ABOUT_ME_READ_WRITE_TOKEN;

        if (removedPathnames?.length) {
            for (const path of removedPathnames) {
                try {
                    await del(path, { token: aboutMeToken });
                } catch (err) {
                    console.warn("Failed to delete removed image:", path);
                }
            }
        }

        //Clean text fields
        const cleanParagraphs: string[] =
            (paragraphs as string[])?.filter(p => p.trim() !== "") ?? [];

        const cleanFacts: string[] =
            (quickFacts as string[])?.filter(v => v.trim() !== "") ?? [];

        // Clean images + KEEP alignment
        const rawImages = (profileImages as string[]) ?? [];
        const rawPathnames = (profileImagePathnames as string[]) ?? [];

        const cleanImages: string[] = [];
        const cleanPathnames: string[] = [];

        for (let i = 0; i < rawImages.length; i++) {
            const img = rawImages[i];
            const path = rawPathnames[i];

            if (img?.trim()) {
                cleanImages.push(img);
                cleanPathnames.push(path ?? "");
            }
        }

        const userId = new mongoose.Types.ObjectId(params.userId);

        let about = await AboutMeModel.findOne({ userId });
 
        // DELETE orphaned/replaced images (DIFF LOGIC)
        if (about) {
            const existingImages = about.profileImages ?? [];
            const existingPathnames = about.profileImagePathnames ?? [];

            const pathnamesToDelete: string[] = [];

            for (let i = 0; i < existingImages.length; i++) {
                const existingImg = existingImages[i];
                const existingPath = existingPathnames[i];

                // If old image is NOT in new list → delete it
                if (!cleanImages.includes(existingImg) && existingPath) {
                    pathnamesToDelete.push(existingPath);
                }
            }

            for (const path of pathnamesToDelete) {
                try {
                    await del(path, { token: aboutMeToken });
                } catch (err) {
                    console.warn("Failed to delete replaced image:", path);
                }
            }
        }

        if (about) {
            about.heading = heading ?? "A little bit about me:";
            about.paragraphs = cleanParagraphs;
            about.quickFacts = cleanFacts;
            about.profileImages = cleanImages;
            about.profileImagePathnames = cleanPathnames;

            await about.save();
        } else {
            about = await AboutMeModel.create({
                userId,
                heading: heading ?? "A little bit about me:",
                paragraphs: cleanParagraphs,
                quickFacts: cleanFacts,
                profileImages: cleanImages,
                profileImagePathnames: cleanPathnames
            });
        }

        return NextResponse.json(
            { message: "About Me updated.", about },
            { status: 200 }
        );

    } catch (err) {
        console.error("[PUT /api/about]", err);
        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
    try {
        await connectToDB();

        if (!mongoose.isValidObjectId(params.userId)) {
            return NextResponse.json({ error: "Invalid user ID." }, { status: 400 });
        }

        const formData = await req.formData();

        const file        = formData.get("file")        as File   | null;
        const slot        = formData.get("slot")        as string | null; // "0" or "1"
        const oldPathname = formData.get("oldPathname") as string | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided." }, { status: 400 });
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: "Invalid file type." }, { status: 400 });
        }

        const aboutMeToken = process.env.BLOB_ABOUT_ME_READ_WRITE_TOKEN;
        if (!aboutMeToken) {
            return NextResponse.json({ error: "Blob store token not configured." }, { status: 500 });
        }

        // Delete the old blob for this slot if one exists
        if (oldPathname) {
            try {
                await del(oldPathname, { token: aboutMeToken });
            } catch (err) {
                console.warn("[POST /api/about] Old blob delete failed:", err);
            }
        }

        const ext      = file.name.split(".").pop() ?? "jpg";
        const slotId   = slot === "1" ? "1" : "0";
        // Path: about_me/<userId>/profile-<slot>-<timestamp>.<ext>
        const filename = `${params.userId}/profile-${slotId}-${Date.now()}.${ext}`;

        const blob = await put(filename, file, {
            access: "public",
            token:  aboutMeToken,   // explicitly target the about_me blob store
        });

        return NextResponse.json({
            url:      blob.url,
            pathname: blob.pathname,
        }, { status: 200 });

    } catch (err) {
        console.error("[POST /api/about]", err);
        return NextResponse.json({ error: "Upload failed." }, { status: 500 });
    }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
    try {
        await connectToDB();

        if (!mongoose.isValidObjectId(params.userId)) {
            return NextResponse.json({ error: "Invalid user ID." }, { status: 400 });
        }

        await AboutMeModel.findOneAndDelete({
            userId: new mongoose.Types.ObjectId(params.userId),
        });

        return NextResponse.json({ message: "About Me deleted." }, { status: 200 });
    } catch (err) {
        console.error("[DELETE /api/about]", err);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
