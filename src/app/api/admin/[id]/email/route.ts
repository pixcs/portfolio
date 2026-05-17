import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { connectToDB } from "@/app/lib/connectToDB";
import { AdminModel } from "@/app/models/models";
import { sessionOptions } from "@/app/lib/lib";
import bcrypt from "bcryptjs";

export const PATCH = async (
    request: NextRequest,
    { params }: { params: { id: string } }
) => {
    const { id } = params;

    if (!id) {
        return NextResponse.json(
            { error: "You forgot to include an id!" },
            { status: 400 }
        );
    }

    const { newEmail, newUsername, currentPassword } = await request.json();

    if (!currentPassword || (!newEmail && !newUsername)) {
        return NextResponse.json(
            { error: "Current password and at least one of new email or username are required." },
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

    const isMatch = await bcrypt.compare(currentPassword, admin.password);

    if (!isMatch) {
        return NextResponse.json(
            { error: "Current password is incorrect." },
            { status: 401 }
        );
    }

    if (newEmail) {
        const emailTaken = await AdminModel.findOne({ email: newEmail });
        if (emailTaken) {
            return NextResponse.json(
                { error: "That email is already in use." },
                { status: 409 }
            );
        }
        admin.email = newEmail;
    }

    if (newUsername) {
        const usernameTaken = await AdminModel.findOne({ 
            username: newUsername,
            _id: { $ne: id }  //  exclude the current user
        });
        if (usernameTaken) {
            return NextResponse.json(
                { error: "That username is already taken." },
                { status: 409 }
            );
        }
        admin.username = newUsername;
    }

    await admin.save();

    const session = await getIronSession<SessionData>(
        await cookies(),
        sessionOptions
    );

    if (newEmail)    session.email    = newEmail;
    if (newUsername) session.username = newUsername;

    await session.save();

    const message =
        newEmail && newUsername ? "Email and username updated successfully." :
        newEmail                ? "Email updated successfully."              :
                                  "Username updated successfully.";

    return NextResponse.json({ message });
};