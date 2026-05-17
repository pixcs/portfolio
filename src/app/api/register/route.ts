import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import axios from "axios";
import { connectToDB } from "@/app/lib/connectToDB";
import { AdminModel } from "@/app/models/models";

// ── reCAPTCHA verification ────────────────────────────────────────────
async function verifyCaptcha(token: string): Promise<boolean> {
  try {
    const res = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: token,
        },
      }
    );
    // v3 returns a score — 0.5+ is generally considered human
    return res.data.success && res.data.score >= 0.5;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, username, password, captchaToken } = body;

    // ── 1. Basic field validation ─────────────────────────────────────
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: "Email, username, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 8 || password.length > 20) {
      return NextResponse.json(
        { error: "Password must be between 8 and 20 characters." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (username.length < 3 || username.length > 30) {
      return NextResponse.json(
        { error: "Username must be between 3 and 30 characters." },
        { status: 400 }
      );
    }

    const usernameRegex = /^[a-zA-Z0-9_ -]+$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { error: "Username can only contain letters, numbers, spaces, hyphens, and underscores." },
        { status: 400 }
      );
    }

    // ── 2. reCAPTCHA verification ─────────────────────────────────────
    if (!captchaToken) {
      return NextResponse.json(
        { error: "reCAPTCHA token missing." },
        { status: 400 }
      );
    }

    const captchaValid = await verifyCaptcha(captchaToken);
    if (!captchaValid) {
      return NextResponse.json(
        { error: "reCAPTCHA verification failed. Please try again." },
        { status: 400 }
      );
    }

    // ── 3. DB connection ──────────────────────────────────────────────
    await connectToDB();

    // ── 4. Check for duplicate email or username ──────────────────────
    const existingEmail = await AdminModel.findOne({
      email: email.toLowerCase().trim(),
    }).lean();

    if (existingEmail) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const existingUsername = await AdminModel.findOne({
      username: username.trim(),
    }).lean();

    if (existingUsername) {
      return NextResponse.json(
        { error: "This username is already taken." },
        { status: 409 }
      );
    }

    // ── 5. Hash password ──────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 12);

    // ── 6. Create user ────────────────────────────────────────────────
    const newAdmin = await AdminModel.create({
      email:    email.toLowerCase().trim(),
      username: username.trim(),
      password: hashedPassword,
      isAdmin:  true,
    });

    return NextResponse.json(
      {
        message:  "Account created successfully.",
        userId:   newAdmin._id,
        username: newAdmin.username,
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Register error:", error);

    // Mongoose duplicate key fallback (race condition safety)
    if (error?.code === 11000) {
      const field = Object.keys(error.keyPattern ?? {})[0];
      return NextResponse.json(
        { error: `${field === "email" ? "Email" : "Username"} is already in use.` },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
