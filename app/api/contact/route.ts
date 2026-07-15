import nodemailer from "nodemailer";
import { siteConfig } from "@/lib/site-config";

export const runtime = "nodejs";

// Transactional email is sent through the school's own Google Workspace over
// authenticated SMTP (no third-party sending service). Because the notification
// goes school -> school (from a Workspace mailbox to info@/registrar@), it is
// DKIM/SPF-aligned on the root domain and delivered internally. The transporter
// is null until SMTP_USER + SMTP_PASS are configured, so a missing config
// returns a clean "config" error rather than throwing at module load.
const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT) || 465;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

const mailer =
  SMTP_USER && SMTP_PASS
    ? nodemailer.createTransport({
        host: SMTP_HOST,
        // 465 = implicit TLS; 587 = STARTTLS.
        port: SMTP_PORT,
        secure: SMTP_PORT === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
        // Keep a slow/blocked SMTP dialogue from hanging the serverless function.
        connectionTimeout: 10_000,
        greetingTimeout: 10_000,
        socketTimeout: 15_000,
      })
    : null;

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

type TurnstileResult = "ok" | "failed" | "misconfigured";

async function verifyTurnstile(
  token: string | undefined,
  remoteip: string | undefined
): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    // No secret configured. In production this is a misconfiguration and we
    // fail closed; in local dev without keys we skip so submissions still work.
    if (process.env.NODE_ENV === "production") {
      console.error(
        "TURNSTILE_SECRET_KEY not set in production; failing captcha closed."
      );
      return "misconfigured";
    }
    console.warn("TURNSTILE_SECRET_KEY not set; skipping captcha verification.");
    return "ok";
  }
  if (!token) {
    return "failed";
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
    return data.success ? "ok" : "failed";
  } catch {
    return "failed";
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
    const turnstileResult = await verifyTurnstile(
      typeof turnstileToken === "string" ? turnstileToken : undefined,
      remoteip
    );
    if (turnstileResult === "misconfigured") {
      return Response.json({ success: false, error: "config" }, { status: 500 });
    }
    if (turnstileResult === "failed") {
      return Response.json({ success: false, error: "captcha" }, { status: 403 });
    }

    const isAdmissions = inquiryType === "Admissions";
    const recipient = isAdmissions
      ? siteConfig.email.admissions.display
      : siteConfig.email.general.display;
    const subject = isAdmissions
      ? "New Admissions inquiry, St. Joseph's Academy"
      : "New contact form message, St. Joseph's Academy";

    // From is the authenticated mailbox: Google rewrites the From header to the
    // SMTP user unless it is a verified send-as alias, so only the display name
    // is configurable; the address is always SMTP_USER. Families never see it
    // (replyTo routes replies straight to the visitor).
    const fromName = process.env.CONTACT_FROM_NAME || "St. Joseph's Academy";
    const archive = process.env.CONTACT_ARCHIVE_EMAIL;
    const bcc = archive && archive !== recipient ? archive : undefined;

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

    // Dev without SMTP creds: log and succeed so local form testing works.
    // Production must be configured; a missing transporter is a misconfiguration
    // and fails closed with a "config" error, never a silent drop.
    if (!mailer || !SMTP_USER) {
      if (process.env.NODE_ENV === "production") {
        console.error("SMTP not configured in production; cannot send contact email.");
        return Response.json({ success: false, error: "config" }, { status: 500 });
      }
      console.warn(
        `SMTP not configured; skipping send (dev only). Would send:\n${text}`
      );
      return Response.json({ success: true }, { status: 200 });
    }

    try {
      await mailer.sendMail({
        from: { name: fromName, address: SMTP_USER },
        to: recipient,
        bcc,
        replyTo: emailValue,
        subject,
        text,
        html,
      });
    } catch (err) {
      console.error("SMTP send failed:", err);
      return Response.json({ success: false, error: "send" }, { status: 502 });
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Contact route error:", err);
    return Response.json({ success: false, error: "server" }, { status: 500 });
  }
}
