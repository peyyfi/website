export const runtime = "nodejs";

const playerIdPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function forward(method: "GET" | "POST", payload?: { player_id: string; score: number }) {
  try {
    const base = (process.env.WAITLIST_API_URL ?? "http://127.0.0.1:8000").replace(/\/$/, "");
    const response = await fetch(`${base}/api/game/scores/`, {
      method,
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.WAITLIST_API_SECRET ? { Authorization: `Bearer ${process.env.WAITLIST_API_SECRET}` } : {}),
      },
      ...(payload ? { body: JSON.stringify(payload) } : {}),
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) throw new Error("Score service unavailable");
    return Response.json(await response.json(), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ message: "Scores are unavailable. Your best will sync when the connection returns." }, { status: 503 });
  }
}

export async function GET() {
  return forward("GET");
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  // Next can normalize request.url to its internal hostname. Host retains the
  // public hostname used by the browser and by the deployment's routing.
  const publicUrl = new URL(request.url);
  publicUrl.host = request.headers.get("host") ?? publicUrl.host;
  if (origin && origin !== publicUrl.origin) {
    return Response.json({ message: "Invalid origin." }, { status: 403 });
  }
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json({ message: "Send a valid JSON object." }, { status: 400 });
  }
  const { player_id, score } = body as { player_id?: unknown; score?: unknown };
  if (typeof player_id !== "string" || !playerIdPattern.test(player_id) || typeof score !== "number" || !Number.isInteger(score) || score < 1 || score > 864_000) {
    return Response.json({ message: "Send a valid player UUID and whole-number score (1–864000)." }, { status: 400 });
  }
  return forward("POST", { player_id, score });
}
