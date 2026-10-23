import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "../lib/site";

export const alt = "Peyyfi — your everyday USDC and USDT wallet. Join the waitlist for early access.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const [logo, regular, semibold] = await Promise.all([
    readFile(join(process.cwd(), "public/peyyfi-icon.png"), "base64"),
    readFile(join(process.cwd(), "app/fonts/SpaceGrotesk-Regular.ttf")),
    readFile(join(process.cwd(), "app/fonts/SpaceGrotesk-SemiBold.ttf")),
  ]);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", background: "#e7e9ec", color: "#080808", fontFamily: "Space Grotesk" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {/* next/image is not supported by the ImageResponse renderer. */}
            <img src={`data:image/png;base64,${logo}`} alt="" width={72} height={72} style={{ borderRadius: 18 }} />
            <span style={{ fontSize: 40, fontWeight: 600, letterSpacing: -2 }}>Peyyfi</span>
          </div>
          <div style={{ display: "flex", padding: "14px 24px", border: "1px solid #ffd7c4", borderRadius: 40, color: "#b33400", background: "#fff0e8", fontSize: 22 }}>Early access</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 80, fontWeight: 600, lineHeight: 1.05, letterSpacing: -5 }}>
            <span>Your everyday</span>
            <span>stablecoin wallet.</span>
          </div>
          <span style={{ fontSize: 28, color: "#50545b" }}>USDC &amp; USDT. Easy transfers. Virtual cards.</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 24, borderTop: "1px solid #c9cdd3", fontSize: 23 }}>
          <span style={{ color: "#b33400" }}>Join the waitlist</span>
          <span style={{ color: "#50545b" }}>{new URL(site.url).hostname.replace(/^www\./, "")}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Space Grotesk", data: regular, weight: 400, style: "normal" },
        { name: "Space Grotesk", data: semibold, weight: 600, style: "normal" },
      ],
    },
  );
}
