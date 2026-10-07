import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      company?: unknown;
      email?: unknown;
    };

    if (typeof body.company === "string" && body.company.length > 0) {
      return Response.json({ message: "You’re on the list." });
    }

    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email || email.length > 254 || !emailPattern.test(email)) {
      return Response.json(
        { message: "Enter a valid email address." },
        { status: 400 },
      );
    }

    const entry = {
      email,
      joinedAt: new Date().toISOString(),
      source: "peyyfi-website",
    };

    const webhookUrl = process.env.WAITLIST_WEBHOOK_URL;

    if (webhookUrl) {
      const webhookResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.WAITLIST_WEBHOOK_SECRET
            ? { Authorization: `Bearer ${process.env.WAITLIST_WEBHOOK_SECRET}` }
            : {}),
        },
        body: JSON.stringify(entry),
      });

      if (!webhookResponse.ok) {
        throw new Error("The waitlist service rejected the request.");
      }
    } else {
      const storagePath =
        process.env.WAITLIST_STORAGE_PATH ??
        path.join(process.cwd(), "data", "waitlist.ndjson");

      await mkdir(path.dirname(storagePath), { recursive: true });
      await appendFile(storagePath, `${JSON.stringify(entry)}\n`, "utf8");
    }

    return Response.json({ message: "You’re on the list." });
  } catch {
    return Response.json(
      { message: "We couldn’t add you just yet. Please try again." },
      { status: 500 },
    );
  }
}
