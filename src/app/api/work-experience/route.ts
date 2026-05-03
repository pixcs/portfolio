import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { connectToDB } from "@/app/lib/connectToDB";
import { WorkExperience } from "@/app/models/models";

export const POST = async (request: Request) => {
    await connectToDB();

    const formData = await request.formData();
    const userId      = formData.get("userId") as string;
    const companyName = formData.get("companyName") as string;
    const companyUrl  = formData.get("companyUrl") as string;
    const position    = formData.get("position") as string;
    const range       = formData.get("range") as string;
    const tasks       = JSON.parse(formData.get("tasks") as string) as string[];
    const logoFile    = formData.get("companyLogo") as File | null;

    if (!userId) {
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    let companyLogo: string | undefined;

    if (logoFile && logoFile.size > 0) {
        const blob = await put(
            `${userId}/${Date.now()}-${logoFile.name}`,
            logoFile,
            {
                access: "public",
                token: process.env.BLOB_EXPERIENCE_READ_WRITE_TOKEN,
            }
        );
        companyLogo = blob.url;
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