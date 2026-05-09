import { NextResponse } from "next/server";
import { getSession } from "@/app/lib/action";
import { connectToDB } from "@/app/lib/connectToDB";
import { AdminModel } from "@/app/models/models";
import bcrypt from "bcryptjs";

export const POST = async (request: Request) => {
    const { email, password } = await request.json();

    const session = await getSession();
    await connectToDB();

    const user: Admin | null = await AdminModel.findOne({ email });

    if (!user) {
        return NextResponse.json({ error: "Could not find the user" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return NextResponse.json({ error: "Password doesn't match" }, { status: 401 });
    }

    if (session) {
        session.userId    = user._id.toString();
        session.email     = user.email;
        session.isAdmin   = user.isAdmin;
        session.isLoggedIn = true;

        await session.save();
    }

    return NextResponse.json({ user });
};