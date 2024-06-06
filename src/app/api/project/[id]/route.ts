import { NextResponse } from "next/server";
import { connectToDB } from "@/app/lib/connectToDB";
import { ProjectModel } from "@/app/models/models";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";


export const GET = async (request: Request, { params: { id } }: Params) => {
    await connectToDB();
    const project: Project | null = await ProjectModel.findOne({ _id: id });

    if (!id) {
        return NextResponse.json({ error: "You must include the id." }, { status: 401 })
    }

    if (!project) {
        return NextResponse.json({ error: `project ${id} not found,` }, { status: 401 })
    }

    return NextResponse.json({ project })
}

export const PUT = async (request: Request, { params: { id } }: Params) => {
    const { projectName, projectImage, projectUrl, description, toolsAndTech }: Project = await request.json();
    await connectToDB();
    await ProjectModel.updateOne({ _id: id }, {
        $set: {
            projectName,
            projectImage,
            projectUrl,
            description,
            toolsAndTech
        }
    })

    if (!id) {
        return NextResponse.json({ error: "id not found" }, { status: 401 })
    }

    return NextResponse.json({ success: "Updated Successfully" })
}