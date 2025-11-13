"use client";

import { FormEvent, useState } from "react";

type FormState = {
  fullName: string;
  phoneNumber: string;
  message: string;
};

const defaultMessage = `Hello {{name}}, thanks for registering! We're excited to connect with you. Reply YES to confirm you received this WhatsApp message.`;

export default function HomePage() {
  const [formState, setFormState] = useState<FormState>({
    fullName: "",
    phoneNumber: "",
    message: defaultMessage,
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSending(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to send message");
      }

      setStatus({ type: "success", message: "WhatsApp message sent successfully." });
      setFormState((state) => ({ ...state, fullName: "", phoneNumber: "" }));
    } catch (error) {
      const reason = error instanceof Error ? error.message : "Unexpected error";
      setStatus({ type: "error", message: reason });
    } finally {
      setSending(false);
    }
  }

  return (
    <main>
      <div className="form-card">
        <div className="form-header">
          <h1>WhatsApp Lead Agent</h1>
          <span className="tag">Automated Outreach</span>
        </div>
        <p className="small">
          Capture a lead from your web form and instantly communicate with them over WhatsApp.
          Customize the message below and hit send. The agent replaces <code>{"{{name}}"}</code> with the
          lead&apos;s real name.
        </p>
        <form onSubmit={handleSubmit} noValidate>
          <div className="inline">
            <div className="field">
              <label htmlFor="fullName">Lead name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Alex Johnson"
                required
                value={formState.fullName}
                onChange={(event) =>
                  setFormState((state) => ({ ...state, fullName: event.target.value }))
                }
              />
            </div>
            <div className="field">
              <label htmlFor="phoneNumber">WhatsApp number</label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="+15551234567"
                required
                pattern="^\\+?[1-9]\\d{6,14}$"
                value={formState.phoneNumber}
                onChange={(event) =>
                  setFormState((state) => ({ ...state, phoneNumber: event.target.value }))
                }
              />
              <p className="small">Use E.164 format (country code + number).</p>
            </div>
          </div>
          <div className="field">
            <label htmlFor="message">Message template</label>
            <textarea
              id="message"
              name="message"
              required
              value={formState.message}
              onChange={(event) =>
                setFormState((state) => ({ ...state, message: event.target.value }))
              }
            />
            <p className="small">Use <code>{"{{name}}"}</code> as a merge tag for the lead&apos;s name.</p>
          </div>
          <button type="submit" disabled={sending}>
            {sending ? "Sending…" : "Send WhatsApp message"}
          </button>
        </form>
        {status.type !== "idle" && (
          <div className={`status ${status.type}`}>
            {status.message}
          </div>
        )}
        <footer>
          Need help configuring WhatsApp? Provide your Twilio WhatsApp credentials in the Vercel project
          settings as <code>TWILIO_ACCOUNT_SID</code>, <code>TWILIO_AUTH_TOKEN</code>, and <code>TWILIO_WHATSAPP_FROM</code>.
        </footer>
      </div>
    </main>
  );
}
