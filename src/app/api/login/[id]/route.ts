import { NextResponse } from "next/server";
import { connectToDB } from "@/app/lib/connectToDB";
import { AdminModel } from "@/app/models/models";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

export const GET = async (request: Request, { params: { id } }: Params) => {
    await connectToDB();
    const admin: unknown = await AdminModel.findById({ _id: id }, {
        email: false,  //this will not include email, password, and isAdmin field
        password: false,
        isAdmin: false
    }
    );

    if (!id) {
        return NextResponse.json({ error: "You forgot to include an id!" }, { status: 400 });
    }

    return NextResponse.json({ admin })
}