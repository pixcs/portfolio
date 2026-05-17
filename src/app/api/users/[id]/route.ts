import { NextResponse } from "next/server";
import { connectToDB } from "@/app/lib/connectToDB";
import { AdminModel, AdminInfoModel } from "@/app/models/models";

export const GET = async (
    _req: Request,
    { params }: { params: { id: string } }
) => {
    try {
        const { id } = params;

        if (!id) {
            return NextResponse.json(
                { error: "ID is required." },
                { status: 400 }
            );
        }

        await connectToDB();

        const user = await AdminModel.findById(id, "_id").lean();

        if (!user) {
            return NextResponse.json(
                { error: "User not found." },
                { status: 404 }
            );
        }

        const info = await AdminInfoModel.findOne(
            { userId: user._id },
            "name profileUrl title"
        ).lean();

        return NextResponse.json({
            user: {
                _id:          user._id.toString(),
                name:         info?.name || "Developer",
                title:        info?.title || "Developer",
                profileImage: info?.profileUrl || null,
            }
        });

    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Failed to fetch user." },
            { status: 500 }
        );
    }
};