import { NextResponse } from "next/server";
import { getSession } from "@/app/lib/action";

export async function GET() {
    const session = await getSession();
    
    return NextResponse.json({
        isLoggedIn: session?.isLoggedIn ?? false,
        userId: session?.userId ?? null,
        email: session?.email ?? null,
    });
}