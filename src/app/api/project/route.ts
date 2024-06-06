import { NextResponse } from "next/server";
import { connectToDB } from "@/app/lib/connectToDB";
import { ProjectModel } from "@/app/models/models";


export const POST = async (request: Request) => {
     const { projectName,  projectImage,  projectUrl,  description, toolsAndTech }: Project = await request.json();

     if (!toolsAndTech.length) {
        return NextResponse.json({ error: "You forgot to include the tools you are using." }, { status: 401 })
    }

     await connectToDB();
     const newProject = new ProjectModel({
        projectName,
        projectImage,
        projectUrl,
        description,
        toolsAndTech
     })

     await newProject.save();
    return NextResponse.json({ message: "successfully inserted the new project" });
}

export const GET = async () => {
    await connectToDB();
    const projects: Project[]  = await ProjectModel.find();

    return NextResponse.json({ projects });
}

export const DELETE = async (request: Request) => {
   const { id }: { id: string } = await request.json();
   await connectToDB();
   await ProjectModel.findByIdAndDelete({ _id: id });

   if(!id) {
    return NextResponse.json({ error: "id not found!" }, { status: 401 })
   }
   
   return NextResponse.json({ success: "Successfully deleted." });
}