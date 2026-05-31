import { NextResponse } from "next/server";
import { connectToDB } from "@/app/lib/connectToDB";
import { GetInTouchModel } from "@/app/models/models";

export const POST = async (request: Request) => {
    const data: GetInTouch = await request.json();
    const { userId, name, email, subject, message } = data; 

    if (!data) {
        return NextResponse.json({ error: "You must fill out the form" }, { status: 400 });
    }

    if (!userId) { 
        return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    await connectToDB();
    const messageToAdmin = new GetInTouchModel({ userId, name, email, subject, message }); 
    await messageToAdmin.save();

    return NextResponse.json({ success: "Sent successfully" });
};

export const GET = async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId"); // READ userId from query param

    if (!userId) {
        return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    await connectToDB();
    const messages = await GetInTouchModel
        .find({ userId }) // FILTER by userId
        .sort({ createdAt: -1 })
        .lean();

    const formatted = messages.map((m) => ({
        ...m,
        _id: m._id.toString(),
    }));

    return NextResponse.json({ messages: formatted });
};