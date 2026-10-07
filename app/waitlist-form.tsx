"use client";

import { FormEvent, useState } from "react";

type FormStatus = "idle" | "submitting" | "success" | "error";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          company: form.get("company"),
        }),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(result.message || "We couldn’t add you just yet.");
      }

      setStatus("success");
      setMessage(result.message || "You’re on the list.");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="success-card" role="status" aria-live="polite">
        <span className="success-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="m6.75 12.5 3.25 3.25 7.25-7.5" />
          </svg>
        </span>
        <span>
          <strong>{message}</strong>
          We&apos;ll let you know when Peyyfi is ready.
        </span>
      </div>
    );
  }

  return (
    <form className="waitlist-form" onSubmit={handleSubmit} noValidate>
      <label className="sr-only" htmlFor="waitlist-email">
        Email address
      </label>
      <div className="form-control">
        <svg className="mail-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3.75 6.75h16.5v10.5H3.75z" />
          <path d="m4.5 7.5 7.5 5.25 7.5-5.25" />
        </svg>
        <input
          id="waitlist-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-describedby={message ? "form-message" : undefined}
          aria-invalid={status === "error"}
          required
        />
        <input
          className="honeypot"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        <button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? (
            <>
              <span className="button-spinner" aria-hidden="true" />
              Joining…
            </>
          ) : (
            "Join the waitlist"
          )}
        </button>
      </div>

      <p
        id="form-message"
        className={`form-message ${status === "error" ? "is-error" : ""}`}
        aria-live="polite"
      >
        {message}
      </p>
    </form>
  );
}
