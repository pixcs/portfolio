import { NextResponse } from "next/server";
import { connectToDB } from "@/app/lib/connectToDB";
import { WorkExperience } from "@/app/models/models";
import { revalidatePath } from "next/cache";

export const GET = async (_req: Request, { params }: { params: { id: string } }) => {
  if (!params.id) {
    return NextResponse.json({ error: "You must include the id." }, { status: 400 });
  }

  await connectToDB();

  const workExp = await WorkExperience.find({ userId: params.id });

  // Bust the cache for that user's portfolio page
  revalidatePath(`/user/${ params.id}`);

  return NextResponse.json({ workExp });
};