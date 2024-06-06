import { connectToDB } from "@/app/lib/connectToDB";
import { GetInTouchModel } from "@/app/models/models";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { NextResponse } from "next/server";

export const DELETE = async (request: Request, { params: { id } }: Params) => {
    await connectToDB();
    await GetInTouchModel.findByIdAndDelete({ _id: id });


    if (!id) {
        return NextResponse.json({ error: "id not found!" }, { status: 400 })
    }

    const messages: GetInTouch[] = await GetInTouchModel.find();


    return NextResponse.json({
        success: "Deleted successfully",
        messages: messages,
    })
}