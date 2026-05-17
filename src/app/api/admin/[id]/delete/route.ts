import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { connectToDB } from "@/app/lib/connectToDB";
import {
    AdminModel,
    AdminInfoModel,
    AboutMeModel,
    SkillsContentModel,
    WorkExperience,
    ProjectModel,
    GetInTouchModel,
} from "@/app/models/models";
import { sessionOptions } from "@/app/lib/lib";
import bcrypt from "bcryptjs";
import { del } from "@vercel/blob";

export const DELETE = async (
    request: NextRequest,
    { params }: { params: { id: string } }
) => {
    const { id } = params;

    if (!id) {
        return NextResponse.json({ error: "Missing user id." }, { status: 400 });
    }

    const { currentPassword } = await request.json();

    if (!currentPassword) {
        return NextResponse.json(
            { error: "Password is required to delete your account." },
            { status: 400 }
        );
    }

    await connectToDB();

    const admin = await AdminModel.findById(id);

    if (!admin) {
        return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);

    if (!isMatch) {
        return NextResponse.json(
            { error: "Incorrect password." },
            { status: 401 }
        );
    }

    /* ── 1. Fetch all records that hold blob URLs ── */
    const [adminInfo, aboutMe, workExps, projects] = await Promise.all([
        AdminInfoModel.findOne({ userId: id }),
        AboutMeModel.findOne({ userId: id }),
        WorkExperience.find({ userId: id }),
        ProjectModel.find({ userId: id }),
    ]);

    /* ── 2. Delete blobs per store ── */

    // Default blob store — profile image
    if (adminInfo?.profileUrl) {
        await del(adminInfo.profileUrl).catch((err) =>
            console.warn("[delete-account] profile blob failed:", err)
        );
    }

    // BLOB_ABOUT_ME store — about me profile images
    if (aboutMe?.profileImagePathnames?.length) {
        await Promise.allSettled(
            aboutMe.profileImagePathnames
                .filter(Boolean)
                .map((pathname) =>
                    del(pathname, {
                        token: process.env.BLOB_ABOUT_ME_READ_WRITE_TOKEN,
                    })
                )
        );
    }

    // BLOB_EXPERIENCE store — company logos
    if (workExps.length) {
        await Promise.allSettled(
            workExps
                .filter((w) => w.companyLogo)
                .map((w) =>
                    del(w.companyLogo, {
                        token: process.env.BLOB_EXPERIENCE_READ_WRITE_TOKEN,
                    })
                )
        );
    }

    // BLOB_PROJECT store — project images
    if (projects.length) {
        await Promise.allSettled(
            projects
                .filter((p) => p.projectImage)
                .map((p) =>
                    del(p.projectImage, {
                        token: process.env.BLOB_PROJECT_READ_WRITE_TOKEN,
                    })
                )
        );
    }

    /* ── 3. Delete all DB records ── */
    await Promise.all([
        AdminInfoModel.deleteOne({ userId: id }),
        AboutMeModel.deleteOne({ userId: id }),
        SkillsContentModel.deleteOne({ userId: id }),
        WorkExperience.deleteMany({ userId: id }),
        ProjectModel.deleteMany({ userId: id }),
        GetInTouchModel.deleteMany({}), // no userId — safe for single-admin app
        AdminModel.findByIdAndDelete(id),
    ]);

    /* ── 4. Destroy session ── */
    const session = await getIronSession<SessionData>(
        await cookies(),
        sessionOptions
    );
    session.destroy();

    return NextResponse.json({ message: "Account deleted successfully." });
};