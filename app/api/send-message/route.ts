import { NextResponse } from "next/server";
import twilio from "twilio";

type Payload = {
  fullName?: string;
  phoneNumber?: string;
  message?: string;
};

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM;

function assertEnv() {
  const missing: string[] = [];

  if (!accountSid) missing.push("TWILIO_ACCOUNT_SID");
  if (!authToken) missing.push("TWILIO_AUTH_TOKEN");
  if (!whatsappFrom) missing.push("TWILIO_WHATSAPP_FROM");

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}. Add them in your Vercel project settings.`,
    );
  }
}

function formatMessage(template: string, fullName: string) {
  return template.replace(/{{\s*name\s*}}/gi, fullName.trim());
}

function sanitizeE164(value: string) {
  const trimmed = value.trim();
  if (!/^\+?[1-9]\d{6,14}$/.test(trimmed)) {
    throw new Error("Phone number must be in valid E.164 format, e.g. +15551234567");
  }
  return trimmed.startsWith("+") ? trimmed : `+${trimmed}`;
}

export async function POST(request: Request) {
  try {
    assertEnv();

    const body: Payload = await request.json();
    const fullName = body.fullName?.trim();
    const phoneNumber = body.phoneNumber?.trim();
    const messageTemplate = body.message?.trim();

    if (!fullName || !phoneNumber || !messageTemplate) {
      return NextResponse.json(
        { error: "Full name, WhatsApp number, and message template are required." },
        { status: 400 },
      );
    }

    const client = twilio(accountSid, authToken);
    const to = `whatsapp:${sanitizeE164(phoneNumber)}`;
    const from = whatsappFrom?.startsWith("whatsapp:")
      ? whatsappFrom
      : `whatsapp:${whatsappFrom}`;
    const bodyText = formatMessage(messageTemplate, fullName);

    await client.messages.create({
      from,
      to,
      body: bodyText,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
