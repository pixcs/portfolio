// src/app/api/project/[id]/route.ts
import { NextResponse } from "next/server";
import { connectToDB } from "@/app/lib/connectToDB";
import { ProjectModel } from "@/app/models/models";

type Params = { params: { id: string } };

export const GET = async (_req: Request, { params }: Params) => {
    if (!params.id) {
        return NextResponse.json({ error: "You must include the id." }, { status: 400 });
    }

    await connectToDB();

    const project = await ProjectModel.findById(params.id);

    if (!project) {
        return NextResponse.json({ error: `Project ${params.id} not found.` }, { status: 404 });
    }

    return NextResponse.json({ project });
};

export const PUT = async (request: Request, { params }: Params) => {
    const { userId, projectName, projectImage, projectUrl, description, toolsAndTech } =
        await request.json();

    if (!params.id) {
        return NextResponse.json({ error: "id not found." }, { status: 400 });
    }

    if (!userId) {
        return NextResponse.json({ error: "Missing userId." }, { status: 400 });
    }

    await connectToDB();

    await ProjectModel.updateOne(
        { _id: params.id, userId }, // prevents cross-user edits
        {
            $set: {
                projectName,
                projectImage,
                projectUrl,
                description,
                toolsAndTech,
            },
        }
    );

    return NextResponse.json({ success: "Updated successfully." });
};
