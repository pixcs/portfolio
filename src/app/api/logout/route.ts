import { NextResponse } from "next/server";
import { getSession } from "@/app/lib/action";

export const POST = async () => {
    const session = await getSession();
    session?.destroy();

    return NextResponse.json({ success: true });
};