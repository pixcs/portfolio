// src/app/api/project/route.ts
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { connectToDB } from "@/app/lib/connectToDB";
import { ProjectModel } from "@/app/models/models";

export const POST = async (request: Request) => {
    const formData    = await request.formData();
    const userId      = formData.get("userId") as string;
    const projectName = formData.get("projectName") as string;
    const projectUrl  = formData.get("projectUrl") as string;
    const description = formData.get("description") as string;
    const toolsAndTech = JSON.parse(formData.get("toolsAndTech") as string) as string[];
    const imageFile   = formData.get("projectImage") as File | null;

    if (!userId) return NextResponse.json({ error: "Missing userId." }, { status: 400 });
    if (!toolsAndTech?.length) return NextResponse.json(
        { error: "You forgot to include the tools you are using." }, { status: 400 }
    );

    let projectImage: string | undefined;
    if (imageFile && imageFile.size > 0) {
        const blob = await put(
            `${userId}/${Date.now()}-${imageFile.name}`,
            imageFile,
            {
                access: "public",
                token: process.env.BLOB_PROJECT_READ_WRITE_TOKEN,
            }
        );
        projectImage = blob.url;
    }

    await connectToDB();

    const newProject = new ProjectModel({
        userId, projectName, projectImage, projectUrl, description, toolsAndTech,
    });

    await newProject.save();
    return NextResponse.json({ message: "Successfully inserted the new project." });
};

export const GET = async (req: Request) => {
   await connectToDB();

   const { searchParams } = new URL(req.url);
   const userId = searchParams.get("userId");

   const query = userId ? { userId } : {};

   const projects = await ProjectModel.find(query).sort({ createdAt: -1 });

   return NextResponse.json({ projects });
};

export const DELETE = async (request: Request) => {
   const { id }: { id: string } = await request.json();

   if (!id) {
      return NextResponse.json({ error: "id not found!" }, { status: 400 });
   }

   await connectToDB();
   await ProjectModel.findByIdAndDelete({ _id: id });

   return NextResponse.json({ success: "Successfully deleted." });
};