import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { email } = await request.json();
  try {
    await resend.emails.send({
      from: "Signimus <noreply@signimus.com>",
      to: "dvskha@gmail.com",
      subject: "New User Registration",
      html: `<p>New user registered: ${email}</p>`
    });
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    return NextResponse.json({ ok: false, error: (error instanceof Error) ? error.message : "Unknown error" });
  }
}
