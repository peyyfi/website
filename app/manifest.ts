import type { MetadataRoute } from "next";
import { site } from "../lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    description: site.description,
    lang: "en",
    start_url: "/",
    display: "browser",
    background_color: "#e7e9ec",
    theme_color: "#FC4C02",
    icons: [
      { src: "/icons/peyyfi-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/peyyfi-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
