import { NextResponse } from "next/server";
import { getSession } from "@/app/lib/action";
import { connectToDB } from "@/app/lib/connectToDB";
import { AdminModel } from "@/app/models/models";
import bcrypt from "bcryptjs";

export const POST = async (request: Request) => {
  try {
    const { email, password, captchaToken } = await request.json();

    if (!captchaToken) {
      return NextResponse.json(
        { error: "Missing reCAPTCHA token" },
        { status: 400 }
      );
    }

    const recaptchaRes = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`,
      }
    );

    const recaptchaData = await recaptchaRes.json();

    if (!recaptchaData.success) {
      return NextResponse.json(
        { error: "reCAPTCHA verification failed" },
        { status: 400 }
      );
    }

    // Optional stricter security
    // v3 gives a score from 0.0 -> 1.0
    if (recaptchaData.score < 0.5) {
      return NextResponse.json(
        { error: "Suspicious activity detected" },
        { status: 400 }
      );
    }

    // ensure the action matches
    if (recaptchaData.action !== "login") {
      return NextResponse.json(
        { error: "Invalid reCAPTCHA action" },
        { status: 400 }
      );
    }


    // Continue login flow
    const session = await getSession();

    await connectToDB();

    const user: Admin | null = await AdminModel.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "Could not find the user" },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Password doesn't match" },
        { status: 401 }
      );
    }

    if (session) {
      session.userId = user._id.toString();
      session.email = user.email;
      session.isAdmin = user.isAdmin;
      session.isLoggedIn = true;

      await session.save();
    }

    return NextResponse.json({ user });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};