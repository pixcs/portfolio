import { NextResponse } from "next/server";
import { getSession } from "@/app/lib/action";
import { connectToDB } from "@/app/lib/connectToDB";
import { AdminModel } from "@/app/models/models";

export const POST = async (request: Request) => {
    const { username, password } = await request.json();

    const session = await getSession();
    console.log("API SESSION:", session);
    await connectToDB();

    const user: Admin | null = await AdminModel.findOne({ username: username })
    console.log(user);

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
        console.log("Session:", session);
        
        await session.save();
    }

    return NextResponse.json({ user })
}
