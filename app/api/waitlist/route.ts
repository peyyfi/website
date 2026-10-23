import { isSupportedCountry } from "libphonenumber-js/max";
import { defaultPhoneCountry, normalizePhoneNumber } from "../../../lib/phone";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const defaultBackendUrl = "http://127.0.0.1:8000";

export async function POST(request: Request) {
  try {
    const payload: unknown = await request.json().catch(() => null);
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return Response.json({ message: "Send a valid JSON object." }, { status: 400 });
    }
    const body = payload as {
      company?: unknown;
      email?: unknown;
      phone_number?: unknown;
      country?: unknown;
    };

    if (typeof body.company === "string" && body.company.length > 0) {
      return Response.json({ message: "You’re on the list." });
    }

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const phone = typeof body.phone_number === "string" ? body.phone_number.trim() : "";

    if (Boolean(email) === Boolean(phone)) {
      return Response.json(
        { message: "Choose either an email address or a phone number." }, { status: 400 },
      );
    }
    let contact: { email: string } | { phone_number: string };
    if (email) {
      if (email.length > 254 || !emailPattern.test(email)) {
        return Response.json({ message: "Enter a valid email address." }, { status: 400 });
      }
      contact = { email };
    } else {
      const country = typeof body.country === "string" ? body.country.trim().toUpperCase() : defaultPhoneCountry;
      const normalizedPhone = isSupportedCountry(country) ? normalizePhoneNumber(phone, country) : null;
      if (!normalizedPhone) {
        return Response.json({ message: "Enter a valid phone number and country code." }, { status: 400 });
      }
      contact = { phone_number: normalizedPhone };
    }

    const backendUrl = (
      process.env.WAITLIST_API_URL ?? defaultBackendUrl
    ).replace(/\/$/, "");
    const backendResponse = await fetch(`${backendUrl}/api/waitlist/`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.WAITLIST_API_SECRET
          ? { Authorization: `Bearer ${process.env.WAITLIST_API_SECRET}` }
          : {}),
      },
      body: JSON.stringify({ ...contact, source: "peyyfi-website" }),
      signal: AbortSignal.timeout(8_000),
    });
    const result = (await backendResponse.json().catch(() => ({}))) as {
      message?: string;
    };

    if (!backendResponse.ok) {
      return Response.json(
        {
          message:
            result.message ??
            "We couldn’t add you just yet. Please try again.",
        },
        {
          status:
            backendResponse.status >= 400 && backendResponse.status < 500
              ? backendResponse.status
              : 503,
        },
      );
    }

    return Response.json({ message: result.message ?? "You’re on the list." });
  } catch {
    return Response.json(
      { message: "We couldn’t add you just yet. Please try again." },
      { status: 503 },
    );
  }
}
