import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { NextResponse } from "next/server";
import { connectToDB } from "@/app/lib/connectToDB";
import { WorkExperience } from "@/app/models/models";


export const GET = async (request: Request, { params: { id } }: Params) => {
    await connectToDB();
    const experience: WorkExperience | null = await WorkExperience.findById({ _id: id })

    if (!id) {
        return NextResponse.json({ error: "id not found." }, { status: 401 })
    }

    return NextResponse.json({ experience });
}

export const PUT = async (request: Request, { params: { id } }: Params) => {
    const { companyName, companyLogo, companyUrl, position, tasks, range }: FormExperience = await request.json();
    const experience = await WorkExperience.updateOne({ _id: id }, {
        $set: {
            companyName,
            companyLogo,
            companyUrl, 
            position,
            tasks,
            range
        }
    })

    console.log(experience);

    return NextResponse.json({  success: "Updated successfully." });
}