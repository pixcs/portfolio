import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDB } from "@/app/lib/connectToDB";       
import { SkillsContentModel } from "@/app/models/models";   
import { revalidatePath } from "next/cache";

type Params = { params: { userId: string } };

export async function GET(_req: NextRequest, { params }: Params) {
    try {
        await connectToDB();

        const { userId } = params;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json({ error: "Invalid user ID." }, { status: 400 });
        }

        const doc = await SkillsContentModel.findOne({ userId }).lean();

        if (!doc) {
            return NextResponse.json({ enabledSkills: [] }, { status: 200 });
        }

        return NextResponse.json({ enabledSkills: doc.enabledSkills }, { status: 200 });

    } catch (err) {
        console.error("[GET /api/skills]", err);
        return NextResponse.json({ error: "Failed to fetch skills." }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: Params) {
    try {
        await connectToDB();

        const { userId } = params;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json({ error: "Invalid user ID." }, { status: 400 });
        }

        const body = await req.json();
        const { enabledSkills } = body;

        if (!Array.isArray(enabledSkills)) {
            return NextResponse.json({ error: "enabledSkills must be an array." }, { status: 400 });
        }

        // Validate each item has the required fields
        for (const skill of enabledSkills) {
            if (!skill.iconKey || !skill.name || !skill.color || !skill.category) {
                return NextResponse.json(
                    { error: `Invalid skill entry: ${JSON.stringify(skill)}` },
                    { status: 400 }
                );
            }
        }

        const doc = await SkillsContentModel.findOneAndUpdate(
            { userId },
            { $set: { enabledSkills } },
            { upsert: true, new: true }
        );


        // Bust the cache for that user's portfolio page
        revalidatePath(`/user/${userId}`);

        return NextResponse.json(
            { message: "Skills updated successfully.", enabledSkills: doc.enabledSkills },
            { status: 200 }
        );

    } catch (err) {
        console.error("[PUT /api/skills]", err);
        return NextResponse.json({ error: "Failed to update skills." }, { status: 500 });
    }
}