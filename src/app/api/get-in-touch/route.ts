import { NextResponse } from "next/server";
import { connectToDB } from "@/app/lib/connectToDB";
import { GetInTouchModel } from "@/app/models/models";


export const POST = async (request: Request) => {
    const data: GetInTouch = await request.json();
    const { name, email, subject, message } = data;

    if (!data) {
        return NextResponse.json({ error: "You must fill out the form" }, { status: 400 })
    }

    await connectToDB();
    const messageToAdmin = new GetInTouchModel({
        name,
        email,
        subject,
        message
    })
    await messageToAdmin.save();

    return NextResponse.json({ success: "Sent successfully" })
}

export const GET = async () => {
    await connectToDB();
    const messages: GetInTouch[] = await GetInTouchModel.find().sort({ createdAt: -1 });

    return NextResponse.json({ messages });
}


