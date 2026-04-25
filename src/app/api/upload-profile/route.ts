// app/api/upload-profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { put, del } from "@vercel/blob";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();

        const file = formData.get("file") as File | null;
        const oldPathname = formData.get("oldPathname") as string | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided." }, { status: 400 });
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type." },
                { status: 400 }
            );
        }

        // DELETE OLD FILE FIRST
        if (oldPathname) {
            try {
                await del(oldPathname);
            } catch (err) {
                console.log("Delete failed:", err);
            }
        }

        // UPLOAD NEW FILE
        const ext = file.name.split(".").pop() ?? "jpg";
        const filename = `profile-${Date.now()}.${ext}`;

        const blob = await put(filename, file, {
            access: "public",
        });

        return NextResponse.json({
            url: blob.url,
            pathname: blob.pathname, // IMPORTANT for next delete
        });

    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Upload failed" },
            { status: 500 }
        );
    }
}