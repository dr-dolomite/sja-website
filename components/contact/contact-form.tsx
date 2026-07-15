"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { m, type Variants } from "motion/react";
import Script from "next/script";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { siteConfig } from "@/lib/site-config";

// The form posts to our own /api/contact route, which sends the notification
// through the school's Google Workspace over SMTP and, when configured,
// verifies a Cloudflare Turnstile token server-side.
// The site key below is public by design (Turnstile's client widget requires
// it); the matching secret key lives only on the server.
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

// Light validation, not a full RFC 5322 parser: with preventDefault + fetch
// the browser never runs its own constraint validation UI, so this is the
// real gate, not a backstop for it.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INQUIRY_OPTIONS = [
  { value: "Admissions", label: "Admissions" },
  { value: "General inquiry", label: "General inquiry" },
  { value: "Other", label: "Other" },
] as const;

// Same transform-only rise + stagger contract as contact.tsx / site-footer.tsx.
// Hidden state never touches opacity, so the form is fully legible before any
// motion runs; this component renders inside Contact's own LazyMotion +
// MotionConfig tree, so it reuses that context rather than opening a second one.
const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { delayChildren: 0.05, staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 24 },
  show: {
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

type FieldErrors = { name?: string; email?: string; message?: string };
type TouchedFields = { name?: boolean; email?: boolean; message?: boolean };
type Status = "idle" | "submitting" | "success" | "error";

function validate(values: {
  name: string;
  email: string;
  message: string;
}): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.name.trim()) {
    errors.name = "Please enter your full name.";
  }
  if (!values.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  if (!values.message.trim()) {
    errors.message = "Please enter a message.";
  }
  return errors;
}

// Error text runs on the Coconut/Leaf-Tint ground, so the raw --destructive
// token (oklch 0.577 0.22 27, tuned for a border/ring, ~3.4-3.8:1 as text on
// Leaf Tint) is not trustworthy here. text-red-700 (#B91C1C) computes to
// about 5.7:1 on Leaf Tint (#EDF3ED) and higher still on Coconut (#FBFAF6),
// clearing the 4.5:1 floor with real headroom. Every use is paired with an
// icon, never color alone.
function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p
      id={id}
      className="flex items-center gap-1.5 text-[13px] font-medium leading-snug text-red-700"
    >
      <AlertCircle aria-hidden="true" className="size-3.5 shrink-0" />
      {children}
    </p>
  );
}

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [inquiryType, setInquiryType] = useState<string>("General inquiry");
  const [message, setMessage] = useState("");
  // Honeypot: a real field named `botcheck`, hidden from sighted and
  // assistive-tech users alike. Bots that fill every field trip it; humans
  // never see it, so it never costs them anything. The server re-checks it
  // too, since a client-only check is trivial for a bot to skip.
  const [honeypot, setHoneypot] = useState(false);

  const [touched, setTouched] = useState<TouchedFields>({});
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  // Belt-and-suspenders against double submit: `status === "submitting"`
  // already blocks it, but a ref guard survives even a stale-closure re-fire.
  const isSubmittingRef = useRef(false);

  const successRef = useRef<HTMLDivElement>(null);

  // Turnstile: rendered explicitly (not the implicit data-sitekey div) so we
  // control exactly when it mounts and can reset it between submit attempts.
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileReady, setTurnstileReady] = useState(false);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetIdRef = useRef<string | undefined>(undefined);
  const turnstileRenderedRef = useRef(false);

  // Fallback for the case where the Turnstile script was already cached and
  // loaded (e.g. client-side navigation back to this page), so `onLoad`
  // never fires again: poll briefly for `window.turnstile`.
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || turnstileReady) {
      return;
    }
    const interval = setInterval(() => {
      if (typeof window !== "undefined" && window.turnstile) {
        setTurnstileReady(true);
        clearInterval(interval);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [turnstileReady]);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !turnstileReady || turnstileRenderedRef.current) {
      return;
    }
    if (!turnstileRef.current || !window.turnstile) {
      return;
    }
    turnstileRenderedRef.current = true;
    turnstileWidgetIdRef.current = window.turnstile.render(turnstileRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      callback: (token) => setTurnstileToken(token),
      "expired-callback": () => setTurnstileToken(""),
      "error-callback": () => setTurnstileToken(""),
    });
  }, [turnstileReady]);

  // Move focus to the confirmation panel and announce it, per the
  // aria-live contract below.
  useEffect(() => {
    if (status === "success") {
      successRef.current?.focus();
    }
  }, [status]);

  function handleBlur(field: keyof FieldErrors) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validate({ name, email, message }));
  }

  function handleChange(
    field: "name" | "email" | "message",
    value: string,
    setter: (value: string) => void
  ) {
    setter(value);
    if (touched[field]) {
      setErrors(
        validate({
          name: field === "name" ? value : name,
          email: field === "email" ? value : email,
          message: field === "message" ? value : message,
        })
      );
    }
  }

  function handleReset() {
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setInquiryType("General inquiry");
    setHoneypot(false);
    setTouched({});
    setErrors({});
    setStatus("idle");
    setTurnstileToken("");
    if (window.turnstile) {
      window.turnstile.reset(turnstileWidgetIdRef.current);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate({ name, email, message });
    setErrors(nextErrors);
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    if (isSubmittingRef.current) {
      return;
    }

    // Honeypot: a bot that filled the hidden field gets a silent, ordinary
    // success with nothing actually sent. The server re-checks `botcheck`
    // too, but short-circuiting here avoids the round trip entirely.
    if (honeypot) {
      setStatus("success");
      return;
    }

    // If Turnstile is configured but hasn't handed us a token yet (widget
    // still loading, or the visitor hasn't finished the challenge), don't
    // submit; surface the error state so the mailto fallback is offered
    // rather than silently failing server-side.
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setStatus("error");
      return;
    }

    isSubmittingRef.current = true;
    setStatus("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          inquiryType,
          message: message.trim(),
          botcheck: honeypot,
          turnstileToken,
        }),
      });
      const data: { success?: boolean } | null = await response
        .json()
        .catch(() => null);

      if (response.ok && data?.success) {
        setStatus("success");
      } else {
        // Any server-side rejection surfaces the same inline error + mailto.
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      isSubmittingRef.current = false;
      setTurnstileToken("");
      if (window.turnstile) {
        window.turnstile.reset(turnstileWidgetIdRef.current);
      }
    }
  }

  if (status === "success") {
    return (
      <m.div
        ref={successRef}
        role="status"
        aria-live="polite"
        tabIndex={-1}
        variants={itemVariants}
        initial="hidden"
        animate="show"
        className="flex flex-col items-start gap-3 rounded-[28px] border border-border bg-card p-8 outline-none sm:p-10"
      >
        <CheckCircle2 aria-hidden="true" className="size-9 text-primary" />
        <h3 className="font-serif text-2xl text-grove-deep">
          Thank you, we&rsquo;ll be in touch.
        </h3>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          {/* PLACEHOLDER: confirm reply-time wording with the registrar's
             office before launch. */}
          Your message has reached our registrar&rsquo;s office. We typically
          reply within a school day or two.
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-sm text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Send another message
        </button>
      </m.div>
    );
  }

  return (
    <m.form
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      onSubmit={handleSubmit}
      aria-labelledby="contact-form-heading"
      noValidate
      className="flex flex-col gap-6"
    >
      <m.div variants={itemVariants} className="flex flex-col gap-2">
        <h3
          id="contact-form-heading"
          className="font-serif text-2xl text-grove-deep"
        >
          Send us a message
        </h3>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          {/* PLACEHOLDER: intro line, pending school sign-off. */}
          Prospective families and Guardians alike are welcome to write in.
          We read every message.
        </p>
        <p className="text-[13px] text-muted-foreground">
          Fields marked <span aria-hidden="true">*</span>
          <span className="sr-only">asterisk</span> are required.
        </p>
      </m.div>

      {/* Honeypot: a real field bots fill in, invisible and unreachable for
         everyone else. Not part of the visible tab order or AT tree. */}
      <input
        type="checkbox"
        name="botcheck"
        id="botcheck"
        autoComplete="off"
        tabIndex={-1}
        aria-hidden="true"
        style={{ display: "none" }}
        checked={honeypot}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setHoneypot(event.target.checked)
        }
      />

      <m.div variants={itemVariants} className="flex flex-col gap-1.5">
        <Label htmlFor="contact-name">
          Full name
          <span aria-hidden="true" className="text-muted-foreground">
            *
          </span>
          <span className="sr-only"> (required)</span>
        </Label>
        <Input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(event) =>
            handleChange("name", event.target.value, setName)
          }
          onBlur={() => handleBlur("name")}
          aria-invalid={Boolean(touched.name && errors.name)}
          aria-describedby={
            touched.name && errors.name ? "contact-name-error" : undefined
          }
          className="h-11 bg-card"
        />
        {touched.name && errors.name && (
          <FieldError id="contact-name-error">{errors.name}</FieldError>
        )}
      </m.div>

      <m.div variants={itemVariants} className="flex flex-col gap-1.5">
        <Label htmlFor="contact-email">
          Email address
          <span aria-hidden="true" className="text-muted-foreground">
            *
          </span>
          <span className="sr-only"> (required)</span>
        </Label>
        <Input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) =>
            handleChange("email", event.target.value, setEmail)
          }
          onBlur={() => handleBlur("email")}
          aria-invalid={Boolean(touched.email && errors.email)}
          aria-describedby={
            touched.email && errors.email ? "contact-email-error" : undefined
          }
          className="h-11 bg-card"
        />
        {touched.email && errors.email && (
          <FieldError id="contact-email-error">{errors.email}</FieldError>
        )}
      </m.div>

      <m.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2"
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact-inquiry-type">Type of inquiry</Label>
          <Select
            value={inquiryType}
            onValueChange={(value) => value && setInquiryType(value)}
            name="inquiry_type"
          >
            <SelectTrigger
              id="contact-inquiry-type"
              // The base trigger sets height via `data-[size=default]:h-8`,
              // which compiles to a class+attribute selector (specificity
              // 0,2,0) and outranks a plain `h-11`. Match the same variant so
              // the override actually wins and the box lines up with the inputs.
              className="w-full bg-card data-[size=default]:h-11"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INQUIRY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact-phone">Phone (optional)</Label>
          <Input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="h-11 bg-card"
          />
        </div>
      </m.div>

      <m.div variants={itemVariants} className="flex flex-col gap-1.5">
        <Label htmlFor="contact-message">
          Message
          <span aria-hidden="true" className="text-muted-foreground">
            *
          </span>
          <span className="sr-only"> (required)</span>
        </Label>
        <Textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder="Tell us a little about your question, and the best way to reach you."
          value={message}
          onChange={(event) =>
            handleChange("message", event.target.value, setMessage)
          }
          onBlur={() => handleBlur("message")}
          aria-invalid={Boolean(touched.message && errors.message)}
          aria-describedby={
            touched.message && errors.message
              ? "contact-message-error"
              : undefined
          }
          className="min-h-36 bg-card"
        />
        {touched.message && errors.message && (
          <FieldError id="contact-message-error">{errors.message}</FieldError>
        )}
      </m.div>

      {TURNSTILE_SITE_KEY && (
        <>
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js"
            async
            defer
            onLoad={() => setTurnstileReady(true)}
          />
          {/* Cloudflare Turnstile: an unobtrusive bot check, usually invisible
             in managed mode. No new palette colors or shadows; the widget
             renders its own compact challenge UI only when needed. */}
          <m.div variants={itemVariants} ref={turnstileRef} />
        </>
      )}

      <m.div variants={itemVariants} className="flex flex-col gap-4">
        {status === "error" && (() => {
          // Route the fallback mailto to the same inbox the form would have
          // used, so admissions inquiries still land with the registrar.
          const fallback =
            inquiryType === "Admissions"
              ? siteConfig.email.admissions
              : siteConfig.email.general;
          return (
            // Functional error banner: a soft red that stays clearly off the
            // green palette without shouting. red-700 text on red-50 clears AA
            // with headroom (the raw --destructive token would not here), and
            // the icon keeps it from relying on color alone.
            <Alert className="items-start border-red-200 bg-red-50 text-red-700">
              <AlertCircle aria-hidden="true" />
              <AlertDescription className="text-[14px] leading-relaxed text-red-700">
                {/* PLACEHOLDER: error copy, pending school sign-off. */}
                Something went wrong sending your message. Please try again,
                or email us directly at{" "}
                <a
                  href={fallback.href}
                  className="font-semibold text-red-800 underline underline-offset-4 hover:text-red-900"
                >
                  {fallback.display}
                </a>
                .
              </AlertDescription>
            </Alert>
          );
        })()}
        <Button
          type="submit"
          disabled={status === "submitting"}
          aria-busy={status === "submitting"}
          className="h-12 w-full rounded-full text-base font-semibold disabled:opacity-100 sm:w-fit sm:px-10"
        >
          {status === "submitting" ? (
            <>
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
              Sending…
            </>
          ) : (
            "Send message"
          )}
        </Button>
        <p className="text-[12.5px] leading-relaxed text-muted-foreground">
          {/* PLACEHOLDER: privacy wording pending school sign-off. */}
          We use your details only to reply to your inquiry.
        </p>
      </m.div>
    </m.form>
  );
}
