import { NextResponse } from "next/server";
import { connectToDB } from "@/app/lib/connectToDB";
import { AdminModel } from "@/app/models/models";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

export const GET = async (request: Request, { params: { id } }: Params) => {
    await connectToDB();
    const admin: unknown = await AdminModel.findById({ _id: id }, {
        username: false,   //this will not include username, password, and isAdmin field
        password: false,
        isAdmin: false
    }
    );

    if (!id) {
        return NextResponse.json({ error: "You forgot to include an id!" }, { status: 400 });
    }

    return NextResponse.json({ admin })
}

export const PUT = async (request: Request, { params: { id } }: Params) => {
    const {
        name,
        about,
        address,
        colorStatus,
        status,
        githubUrl,
        facebookUrl,
        profileUrl,
        resumeUrl
    }: AdminInfo = await request.json();
    await connectToDB();
    await AdminModel.updateOne({ _id: id }, {
        $set: {
            info: {
                name,
                about,
                address,
                colorStatus,
                status,
                githubUrl,
                facebookUrl,
                profileUrl,
                resumeUrl
            }
        }
    });

    if (!id) {
        return NextResponse.json({ error: "You forgot to include an id!" }, { status: 400 });
    }

    return NextResponse.json({ message: "Updated Sucessfully" })
}