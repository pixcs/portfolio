import { NextResponse } from "next/server";
import { connectToDB } from "@/app/lib/connectToDB";
import { WorkExperience } from "@/app/models/models";

export const POST = async (request: Request) => {
    const { userId, companyName, companyLogo, companyUrl, position, tasks, range } = await request.json();

    await connectToDB();

    if (!userId) {
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const newWorkExperience = new WorkExperience({
        userId,
        companyName,
        companyLogo,
        companyUrl,
        position,
        tasks,
        range,
    });

    await newWorkExperience.save();

    return NextResponse.json({ success: "Created successfully" });
};


export const GET = async (req: Request) => {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const query = userId ? { userId } : {};

    const list_of_experience = await WorkExperience.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ list_of_experience });
};

export const DELETE = async (request: Request) => {
    const { id } = await request.json();
    await connectToDB();

    if (!id) {
        return NextResponse.json({ error: "id not found!" }, { status: 401 })
    }

    await WorkExperience.findByIdAndDelete({ _id: id });

    return NextResponse.json({ success: "successfully deleted" });
}