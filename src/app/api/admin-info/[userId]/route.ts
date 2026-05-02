// app/api/admin-info/[userId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import mongoose from "mongoose";
import { connectToDB } from "@/app/lib/connectToDB";
import { AdminInfoModel } from "@/app/models/models";

type Params = { params: { userId: string } };

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

        const userId = new mongoose.Types.ObjectId(params.userId);

        const info = await AdminInfoModel.findOneAndUpdate(
            { userId },
            { ...body, userId },
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

        // delete old blob
        if (oldPathname) {
        try {
            await del(oldPathname);
        } catch (err) {
            console.log("Delete failed:", err);
        }
        }

        const ext = file.name.split(".").pop() ?? "jpg";
        const filename = `profile-${Date.now()}.${ext}`;

        const blob = await put(filename, file, {
            access: "public",
        });

        // update AdminInfo document
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