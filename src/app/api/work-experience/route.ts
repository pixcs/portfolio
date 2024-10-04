import { NextResponse } from "next/server";
import { connectToDB } from "@/app/lib/connectToDB";
import { WorkExperience } from "@/app/models/models";

export const POST = async (request: Request) => {
    const { companyName, companyLogo, companyUrl, position, tasks, range }: FormExperience = await request.json();

    await connectToDB();
    const newWorkExperience = new WorkExperience({
        companyName,
        companyLogo,
        companyUrl,
        position,
        tasks,
        range
    })

    if (!tasks.length) {
        return NextResponse.json({ error: "You forgot to include the tasks" }, { status: 401 })
    }

    const result = await newWorkExperience.save();
    console.log("result:", result);

    return NextResponse.json({ success: "Created successfully" })
}

export const GET = async () => {
    await connectToDB();
    const list_of_experience: WorkExperience[] = await WorkExperience.find().sort({ createdAt: -1 });

    return NextResponse.json({ list_of_experience });
}

export const DELETE = async (request: Request) => {
    const { id } = await request.json();
    await connectToDB();

    if (!id) {
        return NextResponse.json({ error: "id not found!" }, { status: 401 })
    }

    await WorkExperience.findByIdAndDelete({ _id: id });

    return NextResponse.json({ success: "successfully deleted" });
}