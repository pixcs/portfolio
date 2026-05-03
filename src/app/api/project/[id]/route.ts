import { NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
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
    if (!params.id) return NextResponse.json({ error: "id not found." }, { status: 400 });

    const formData    = await request.formData();
    const userId      = formData.get("userId") as string;
    const projectName = formData.get("projectName") as string;
    const projectUrl  = formData.get("projectUrl") as string;
    const description = formData.get("description") as string;
    const toolsAndTech = JSON.parse(formData.get("toolsAndTech") as string) as string[];
    const imageFile   = formData.get("projectImage") as File | null;

    if (!userId) return NextResponse.json({ error: "Missing userId." }, { status: 400 });

    await connectToDB();

    const updatePayload: Record<string, any> = {
        projectName, projectUrl, description, toolsAndTech,
    };

    if (imageFile && imageFile.size > 0) {
        // Delete old blob to avoid orphaned files
        const existing = await ProjectModel.findById(params.id).select("projectImage");
        if (existing?.projectImage) {
            await del(existing.projectImage, {
                token: process.env.BLOB_PROJECT_READ_WRITE_TOKEN,
            });
        }

        const blob = await put(
            `${userId}/${Date.now()}-${imageFile.name}`,
            imageFile,
            {
                access: "public",
                token: process.env.BLOB_PROJECT_READ_WRITE_TOKEN,
            }
        );
        updatePayload.projectImage = blob.url;
    }

    await ProjectModel.updateOne(
        { _id: params.id, userId },
        { $set: updatePayload }
    );

    return NextResponse.json({ success: "Updated successfully." });
};