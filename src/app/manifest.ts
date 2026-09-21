import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} - Full Stack Developer Portfolio`,
    short_name: siteConfig.shortName,
    description: siteConfig.shareDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#071016",
    theme_color: "#071016",
    icons: [],
  };
}
