import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { NextResponse } from "next/server";
import { connectToDB } from "@/app/lib/connectToDB";
import { WorkExperience } from "@/app/models/models";


export const GET = async (req: Request, { params }: { params: { id: string } }) => {
    await connectToDB();

    const experience = await WorkExperience.findById(params.id);

    return NextResponse.json({ experience });
};

export const PUT = async (request: Request, { params }: { params: { id: string } }) => {
    const { companyName, companyLogo, companyUrl, position, tasks, range, userId } =
        await request.json();

    await connectToDB();

    await WorkExperience.findOneAndUpdate(
        { _id: params.id, userId }, //  prevents cross-user edits
        {
            $set: {
                userId,
                companyName,
                companyLogo,
                companyUrl,
                position,
                tasks,
                range,
            },
        }
    );

    return NextResponse.json({ success: "Updated successfully." });
};