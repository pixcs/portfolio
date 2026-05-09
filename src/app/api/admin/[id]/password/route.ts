import { NextResponse } from "next/server";
import { connectToDB } from "@/app/lib/connectToDB";
import { AdminModel } from "@/app/models/models";
import bcrypt from "bcryptjs";

export const PATCH = async (request: Request, { params }: any) => {
    const { id } = params;

    if (!id) {
        return NextResponse.json(
            { error: "You forgot to include an id!" },
            { status: 400 }
        );
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
        return NextResponse.json(
            { error: "Current password and new password are required." },
            { status: 400 }
        );
    }

    if (newPassword.length < 8 || newPassword.length > 20) {
        return NextResponse.json(
            { error: "Password must be between 8 and 20 characters." },
            { status: 400 }
        );
    }

    await connectToDB();

    const admin = await AdminModel.findById(id);

    if (!admin) {
        return NextResponse.json(
            { error: "Could not find the user." },
            { status: 404 }
        );
    }

    // use bcrypt comparison
    const isMatch = await bcrypt.compare(currentPassword, admin.password);

    if (!isMatch) {
        return NextResponse.json(
            { error: "Current password is incorrect." },
            { status: 401 }
        );
    }

    if (currentPassword === newPassword) {
        return NextResponse.json(
            { error: "New password must be different from your current password." },
            { status: 400 }
        );
    }

    // hash new password before saving
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await AdminModel.updateOne(
        { _id: id },
        { $set: { password: hashedPassword } }
    );

    return NextResponse.json({
        message: "Password updated successfully."
    });
};