// app/api/admin-info/[userId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import mongoose from "mongoose";
import { connectToDB } from "@/app/lib/connectToDB";
import { AdminInfoModel } from "@/app/models/models";

type Params = { params: { userId: string } };

// Whitelist of allowed top-level fields for PUT
const ALLOWED_FIELDS = [
    "name",
    "about",
    "address",
    "colorStatus",
    "status",
    "githubUrl",
    "facebookUrl",
    "linkedInUrl",
    "linkedUrl",       // new
    "profileUrl",
    "resumeUrl",
    "metadata",        // new
] as const;

type AllowedField = (typeof ALLOWED_FIELDS)[number];

export async function GET(_req: NextRequest, { params }: Params) {
    try {
        await connectToDB();

        if (!mongoose.isValidObjectId(params.userId)) {
            return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
        }

        const info = await AdminInfoModel.findOne({
            userId: new mongoose.Types.ObjectId(params.userId),
        }).lean();

        return NextResponse.json({ info }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: Params) {
    try {
        await connectToDB();

        if (!mongoose.isValidObjectId(params.userId)) {
            return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
        }

        const body = await req.json();

        // Strip unknown fields — only persist what the schema expects
        const sanitized = ALLOWED_FIELDS.reduce<Partial<Record<AllowedField, unknown>>>(
            (acc, key) => {
                if (key in body) acc[key] = body[key];
                return acc;
            },
            {}
        );

        // Validate metadata shape if provided
        if (sanitized.metadata !== undefined) {
            const meta = sanitized.metadata as Record<string, unknown>;
            const isValidMeta =
                typeof meta === "object" &&
                meta !== null &&
                ["title", "description", "icons"].every(
                    (k) => !(k in meta) || typeof meta[k] === "string"
                );

            if (!isValidMeta) {
                return NextResponse.json(
                    { error: "Invalid metadata shape. Expected { title?, description?, icons? }." },
                    { status: 400 }
                );
            }
        }

        const userId = new mongoose.Types.ObjectId(params.userId);

        const info = await AdminInfoModel.findOneAndUpdate(
            { userId },
            { ...sanitized, userId },
            { new: true, upsert: true }
        );

        return NextResponse.json({ message: "Info updated", info }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// upload profile
export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
    try {
        await connectToDB();

        const formData = await req.formData();

        const file = formData.get("file") as File | null;
        const oldPathname = formData.get("oldPathname") as string | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided." }, { status: 400 });
        }

        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: "Invalid file type." }, { status: 400 });
        }

        // Delete old blob if it exists
        if (oldPathname) {
            try {
                await del(oldPathname);
            } catch (err) {
                console.log("Delete failed:", err);
            }
        }

        const ext = file.name.split(".").pop() ?? "jpg";
        const filename = `${params.userId}/profile-${Date.now()}.${ext}`;

        const blob = await put(filename, file, {
            access: "public",
        });

        await AdminInfoModel.findOneAndUpdate(
            { userId: params.userId },
            { profileUrl: blob.url },
            { upsert: true }
        );

        return NextResponse.json({
            url: blob.url,
            pathname: blob.pathname,
        });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}