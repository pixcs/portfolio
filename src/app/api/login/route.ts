import { NextResponse } from "next/server";
import { getSession } from "@/app/lib/action";
import { connectToDB } from "@/app/lib/connectToDB";
import { AdminModel } from "@/app/models/models";

export const POST = async (request: Request) => {
    const { username, password } = await request.json();

    const session = await getSession();
    await connectToDB();

    const user: Admin | null = await AdminModel.findOne({ username: username })

    if (!user) {
        return NextResponse.json({ error: "Could not find the user" }, { status: 404 })
    }

    if (password !== user.password) {
        return NextResponse.json({ error: "Password doesn't match" }, { status: 401 })
    }

    if(session) {
        session.userId = user?._id;
        session.username = user?.username;
        session.isAdmin = user?.isAdmin;
        session.isLoggedIn = true;
        
        await session.save();
    }

    return NextResponse.json({ user })
}
