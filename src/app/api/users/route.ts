import { NextResponse } from "next/server";
import { connectToDB } from "@/app/lib/connectToDB";
import { AdminModel, AdminInfoModel } from "@/app/models/models";

export const GET = async () => {
    try {
        await connectToDB();

        const users = await AdminModel.find({}, "_id").lean();

        const usersWithInfo = await Promise.all(
            users.map(async (user) => {
                const info = await AdminInfoModel.findOne(
                    { userId: user._id },
                    "name profileUrl title"
                ).lean();

                return {
                    _id:          user._id.toString(),
                    name:         info?.name || "Developer",
                    title:        info?.title || "Developer",
                    profileImage: info?.profileUrl || null,
                };
            })
        );

        return NextResponse.json({ users: usersWithInfo });

    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Failed to fetch users." },
            { status: 500 }
        );
    }
};