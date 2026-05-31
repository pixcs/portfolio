import { connectToDB } from "@/app/lib/connectToDB";
import { GetInTouchModel } from "@/app/models/models";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { NextResponse } from "next/server";

export const DELETE = async (request: Request, { params: { id } }: Params) => {
    if (!id) {
        return NextResponse.json({ error: "id not found!" }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId"); // READ userId

    await connectToDB();
    await GetInTouchModel.findByIdAndDelete({ _id: id });

    const messages = await GetInTouchModel
        .find({ userId }) // FILTER by userId so inbox stays scoped
        .sort({ createdAt: -1 })
        .lean();

    const formatted = messages.map((m) => ({
        ...m,
        _id: m._id.toString(),
    }));

    return NextResponse.json({ success: "Deleted successfully", messages: formatted });
};