import { Resend } from "resend";
import { siteConfig } from "@/lib/site-config";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INQUIRY_TYPES = ["Admissions", "General inquiry", "Other"] as const;
type InquiryType = (typeof INQUIRY_TYPES)[number];

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type TurnstileVerifyResult = {
  success: boolean;
  "error-codes"?: string[];
};

async function verifyTurnstile(
  token: string | undefined,
  remoteip: string | undefined
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // No secret configured: skip verification so local dev without keys
    // still works. Never disable this silently in production.
    console.warn("TURNSTILE_SECRET_KEY not set; skipping captcha verification.");
    return true;
  }
  if (!token) {
    return false;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);
  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret, response: token, remoteip }),
        signal: controller.signal,
      }
    );
    const data = (await response.json()) as TurnstileVerifyResult;
    return Boolean(data.success);
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return Response.json({ success: false, error: "invalid" }, { status: 400 });
    }

    const {
      name,
      email,
      phone,
      inquiryType: rawInquiryType,
      message,
      botcheck,
      turnstileToken,
    } = body as Record<string, unknown>;

    // Honeypot: silently drop, no email sent, no error surfaced.
    if (botcheck) {
      return Response.json({ success: true }, { status: 200 });
    }

    const nameValue = typeof name === "string" ? name.trim() : "";
    const emailValue = typeof email === "string" ? email.trim() : "";
    const phoneValue = typeof phone === "string" ? phone.trim() : "";
    const messageValue = typeof message === "string" ? message.trim() : "";

    if (!nameValue || nameValue.length > 100) {
      return Response.json({ success: false, error: "invalid" }, { status: 400 });
    }
    if (
      !emailValue ||
      emailValue.length > 150 ||
      !EMAIL_PATTERN.test(emailValue)
    ) {
      return Response.json({ success: false, error: "invalid" }, { status: 400 });
    }
    if (!messageValue || messageValue.length > 5000) {
      return Response.json({ success: false, error: "invalid" }, { status: 400 });
    }
    if (phoneValue.length > 50) {
      return Response.json({ success: false, error: "invalid" }, { status: 400 });
    }

    const inquiryType: InquiryType = INQUIRY_TYPES.includes(
      rawInquiryType as InquiryType
    )
      ? (rawInquiryType as InquiryType)
      : "General inquiry";

    const remoteip = request.headers
      .get("x-forwarded-for")
      ?.split(",")[0]
      ?.trim();
    const turnstileOk = await verifyTurnstile(
      typeof turnstileToken === "string" ? turnstileToken : undefined,
      remoteip
    );
    if (!turnstileOk) {
      return Response.json({ success: false, error: "captcha" }, { status: 403 });
    }

    if (!process.env.RESEND_API_KEY) {
      return Response.json({ success: false, error: "config" }, { status: 500 });
    }

    const isAdmissions = inquiryType === "Admissions";
    const recipient = isAdmissions
      ? siteConfig.email.admissions.display
      : siteConfig.email.general.display;
    const subject = isAdmissions
      ? "New Admissions inquiry, St. Joseph's Academy"
      : "New contact form message, St. Joseph's Academy";

    const from =
      process.env.CONTACT_FROM_EMAIL ??
      "St. Joseph's Academy <contact@send.sjamalinao.edu.ph>";
    const archive = process.env.CONTACT_ARCHIVE_EMAIL;
    const bcc =
      archive && archive !== recipient ? [archive] : undefined;

    const phoneDisplay = phoneValue || "Not provided";

    const text = [
      `Inquiry type: ${inquiryType}`,
      `Name: ${nameValue}`,
      `Email: ${emailValue}`,
      `Phone: ${phoneDisplay}`,
      "",
      "Message:",
      messageValue,
    ].join("\n");

    const html = `
      <div style="font-family: sans-serif; font-size: 15px; line-height: 1.6; color: #1a1a1a;">
        <p><strong>Inquiry type:</strong> ${escapeHtml(inquiryType)}</p>
        <p><strong>Name:</strong> ${escapeHtml(nameValue)}</p>
        <p><strong>Email:</strong> ${escapeHtml(emailValue)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phoneDisplay)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(messageValue).replace(/\n/g, "<br />")}</p>
      </div>
    `;

    const { error } = await resend.emails.send({
      from,
      to: [recipient],
      bcc,
      replyTo: emailValue,
      subject,
      text,
      html,
    });

    if (error) {
      console.error("Resend send failed:", error);
      return Response.json({ success: false, error: "send" }, { status: 502 });
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Contact route error:", err);
    return Response.json({ success: false, error: "server" }, { status: 500 });
  }
}
