// src/app/api/about/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDB } from "@/app/lib/connectToDB";
import { AboutMeModel } from "@/app/models/models";

type Params = { params: { userId: string } };

/* GET /api/about/[userId] */
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

/* PUT /api/about/[userId] — upsert  */
export async function PUT(req: NextRequest, { params }: Params) {
    try {
        await connectToDB();

        if (!mongoose.isValidObjectId(params.userId)) {
            return NextResponse.json({ error: "Invalid user ID." }, { status: 400 });
        }

        const body = await req.json();
        const { heading, paragraphs, quickFacts, profileImages } = body;

        const cleanParagraphs: string[] = (paragraphs as string[])
            ?.filter((p) => p.trim() !== "") ?? [];

        const cleanFacts: string[] = (quickFacts as string[])
            ?.filter((v) => v.trim() !== "") ?? [];

        const cleanImages: string[] = (profileImages as string[])
            ?.filter((i) => i.trim() !== "") ?? [];

        const userId = new mongoose.Types.ObjectId(params.userId);

        let about = await AboutMeModel.findOne({ userId });

        if (about) {
            about.heading       = heading ?? "A little bit about me:";
            about.paragraphs    = cleanParagraphs;
            about.quickFacts    = cleanFacts;
            about.profileImages = cleanImages;
            await about.save();
        } else {
            about = await AboutMeModel.create({
                userId,
                heading:       heading ?? "A little bit about me:",
                paragraphs:    cleanParagraphs,
                quickFacts:    cleanFacts,
                profileImages: cleanImages,
            });
        }

        return NextResponse.json({ message: "About Me updated.", about }, { status: 200 });
    } catch (err) {
        console.error("[PUT /api/about]", err);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}

/*  DELETE /api/about/[userId] */
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
