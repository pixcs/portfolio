import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { put, del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { connectToDB } from "@/app/lib/connectToDB";
import { WorkExperience } from "@/app/models/models";


export const GET = async (req: Request, { params }: { params: { id: string } }) => {
    await connectToDB();

    const experience = await WorkExperience.findById(params.id);

    return NextResponse.json({ experience });
};

export const PUT = async (request: Request, { params }: { params: { id: string } }) => {
    await connectToDB();

    const formData    = await request.formData();
    const userId      = formData.get("userId") as string;
    const companyName = formData.get("companyName") as string;
    const companyUrl  = formData.get("companyUrl") as string;
    const position    = formData.get("position") as string;
    const range       = formData.get("range") as string;
    const tasks       = JSON.parse(formData.get("tasks") as string) as string[];
    const logoFile    = formData.get("companyLogo") as File | null;

    const updatePayload: Record<string, any> = {
        userId, companyName, companyUrl, position, tasks, range,
    };

    if (logoFile && logoFile.size > 0) {
        // Delete the old blob first to avoid orphaned files
        const existing = await WorkExperience.findById(params.id).select("companyLogo");
        if (existing?.companyLogo) {
            await del(existing.companyLogo, {
                token: process.env.BLOB_EXPERIENCE_READ_WRITE_TOKEN,
            });
        }

        const blob = await put(
            `${userId}/${Date.now()}-${logoFile.name}`,
            logoFile,
            {
                access: "public",
                token: process.env.BLOB_EXPERIENCE_READ_WRITE_TOKEN,
            }
        );
        updatePayload.companyLogo = blob.url;
    }

    await WorkExperience.findOneAndUpdate(
        { _id: params.id, userId },
        { $set: updatePayload }
    );

    return NextResponse.json({ success: "Updated successfully." });
};