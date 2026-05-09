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

    const { newEmail, currentPassword } = await request.json();

    if (!newEmail || !currentPassword) {
        return NextResponse.json(
            { error: "New email and current password are required." },
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

    const isMatch = await bcrypt.compare(
        currentPassword,
        admin.password
    );

    if (!isMatch) {
        return NextResponse.json(
            { error: "Current password is incorrect." },
            { status: 401 }
        );
    }

    const emailTaken = await AdminModel.findOne({
        email: newEmail
    });

    if (emailTaken) {
        return NextResponse.json(
            { error: "That email is already in use." },
            { status: 409 }
        );
    }

    /* update database */
    admin.email = newEmail;
    await admin.save();

    /* update iron-session */
    const session = await getIronSession<SessionData>(
        await cookies(),
        sessionOptions
    );

    session.email = newEmail;

    await session.save();

    return NextResponse.json({
        message: "Email updated successfully."
    });
};