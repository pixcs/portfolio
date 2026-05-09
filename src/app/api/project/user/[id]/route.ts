import { NextResponse } from "next/server";
import { connectToDB } from "@/app/lib/connectToDB";
import { ProjectModel } from "@/app/models/models";

type Params = { params: { id: string } };

export const GET = async (_req: Request, { params }: Params) => {
  if (!params.id) {
    return NextResponse.json({ error: "You must include the id." }, { status: 400 });
  }

  await connectToDB();

  const projects = await ProjectModel.find({ userId: params.id });

  return NextResponse.json({ projects });
};