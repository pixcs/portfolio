import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { name, email, subject, message } = await request.json();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        await transporter.sendMail({
            from: `"PIC Portfolio" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: `${subject} (from ${name})`,
            html: `
            <div style="
                font-family: Arial, sans-serif;
                background-color: rgb(15, 23, 42);
                background-image: radial-gradient(circle at center, rgba(255,255,255,0.12), rgba(15,23,42,1) 70%);
                padding: 20px;
            ">
                <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgb(255, 255, 255);">
                    
                    <div style="background:#111827; color:#ffffff; padding:20px; text-align:center">
                        <h2 style="margin:0;">📩 New Contact Message</h2>
                    </div>

                    <div style="padding:20px; color:#333;">
                        <p><strong>Name:</strong> ${name}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Subject:</strong> ${subject}</p>

                        <hr style="margin:20px 0; border:none; border-top:1px solid #eee;" />

                        <p style="white-space:pre-line; line-height:1.6;">
                            ${message}
                        </p>
                    </div>

                    <div style="background:#f9fafb; padding:15px; font-size:12px; color:#888; text-align:center;">
                        This message was sent from your portfolio contact form.
                    </div>
                </div>
            </div>
            `,
        });

        // Auto-reply to USER (receipt)
        await transporter.sendMail({
            from: `"PIC Portfolio" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "We received your message",
            html: `
           <div style="
                font-family: Arial, sans-serif;
                background-color: rgb(15, 23, 42);
                background-image: radial-gradient(circle at center, rgba(255,255,255,0.12), rgba(15,23,42,1) 70%);
                padding: 20px;
            ">
                <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.05);">
                    
                    <div style="background:#111827; color:#ffffff; padding:20px; text-align:center;">
                        <h2 style="margin:0;">Thanks for reaching out 👋</h2>
                    </div>

                    <div style="padding:20px; color:#333;">
                        <p>Hi <strong>${name}</strong>,</p>

                        <p style="line-height:1.6;">
                            Thanks for contacting me! I’ve received your message and will get back to you as soon as possible.
                        </p>

                        <div style="margin:20px 0; padding:15px; background:#f9fafb; border-radius:8px;">
                            <p style="margin:0; font-size:14px; color:#555;"><strong>Your message:</strong></p>
                            <p style="margin-top:10px; white-space:pre-line; line-height:1.6;">
                                ${message}
                            </p>
                        </div>

                        <p style="margin-top:20px;">
                            Best regards,<br/>
                            <strong>PIC</strong>
                        </p>
                    </div>

                    <div style="background:#f9fafb; padding:15px; font-size:12px; color:#888; text-align:center;">
                        This is an automated response. Please do not reply to this email.
                    </div>
                </div>
            </div>
            `,
        });

        return NextResponse.json({ success: true, message: 'Email sent!' });
        
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : 'Something went wrong';

        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}