"use client";

import { FormEvent, useRef, useState } from "react";
import { getCountries, getCountryCallingCode, type CountryCode } from "libphonenumber-js/max";
import { defaultPhoneCountry, normalizePhoneNumber } from "../lib/phone";

type FormStatus = "idle" | "submitting" | "success" | "error";

const countryNames = new Intl.DisplayNames(["en"], { type: "region" });
function countryFlag(country: CountryCode) {
  return String.fromCodePoint(...[...country].map((letter) => 127397 + letter.charCodeAt(0)));
}
const phoneCountries = getCountries().map((country) => ({
  country,
  name: countryNames.of(country) || country,
  label: `${countryFlag(country)} ${countryNames.of(country)} (+${getCountryCallingCode(country)})`,
})).sort((a, b) => a.name.localeCompare(b.name, "en"));

export function WaitlistForm() {
  const [contactValue, setContactValue] = useState("");
  const [country, setCountry] = useState<CountryCode>(defaultPhoneCountry);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");
  const [contactInvalid, setContactInvalid] = useState(false);
  const contactRef = useRef<HTMLInputElement>(null);
  const isPhone = !contactValue.includes("@") && /^\s*[+\d(]/.test(contactValue);

  function resetFeedback() {
    setStatus("idle");
    setMessage("");
    setContactInvalid(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const normalizedEmail = contactValue.trim();
    const normalizedPhone = isPhone ? normalizePhoneNumber(contactValue, country) : null;
    if (isPhone ? !normalizedPhone : (
      !normalizedEmail ||
      normalizedEmail.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
    )) {
      setStatus("error");
      setContactInvalid(true);
      setMessage(
        isPhone
          ? "Enter a valid phone number for your selected country."
          : normalizedEmail
          ? "Enter a valid email address or phone number."
          : "Enter your email address or phone number to join the waitlist.",
      );
      contactRef.current?.focus();
      return;
    }

    setStatus("submitting");
    setContactInvalid(false);
    setMessage("");

    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(isPhone ? { phone_number: normalizedPhone, country } : { email: normalizedEmail }),
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
    <form className="waitlist-form" onSubmit={handleSubmit} noValidate aria-busy={status === "submitting"}>
      <label className="form-label" htmlFor="waitlist-contact">
        Email or phone number
      </label>
      <div className={`form-control${isPhone ? " is-phone" : ""}${contactInvalid ? " has-error" : ""}`}>
        {isPhone ? (
          <select
            className="country-select"
            aria-label="Country code"
            name="country"
            value={country}
            disabled={status === "submitting"}
            onChange={(event) => { setCountry(event.target.value as CountryCode); resetFeedback(); }}
          >
            {phoneCountries.map(({ country: code, label }) => <option key={code} value={code}>{label}</option>)}
          </select>
        ) : <svg className="mail-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3.75 6.75h16.5v10.5H3.75z" />
          <path d="m4.5 7.5 7.5 5.25 7.5-5.25" />
        </svg>}
        <input
          id="waitlist-contact"
          ref={contactRef}
          name={isPhone ? "phone_number" : "email"}
          type="text"
          inputMode="text"
          autoComplete={isPhone ? "tel-national" : "email"}
          autoCapitalize="none"
          spellCheck={false}
          placeholder="you@email.com or 024 123 4567"
          maxLength={254}
          disabled={status === "submitting"}
          value={contactValue}
          onChange={(event) => {
            setContactValue(event.target.value);
            if (status === "error") resetFeedback();
          }}
          aria-describedby={message ? "form-message waitlist-note" : "waitlist-note"}
          aria-invalid={contactInvalid}
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
      <p className="form-note" id="waitlist-note">Be first in line. Product updates only, no noise.</p>
    </form>
  );
}
