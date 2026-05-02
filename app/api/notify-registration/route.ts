import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  const { email } = await request.json();
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: false, error: "Missing RESEND_API_KEY" }, { status: 200 });
  }

  try {
    const resend = new Resend(apiKey);
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
