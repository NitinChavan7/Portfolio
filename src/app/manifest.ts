import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nitin Chavan - Full Stack Developer Portfolio",
    short_name: "Nitin.",
    description:
      "Full stack developer portfolio for React, Node.js, PostgreSQL, REST APIs, dashboards, admin panels, and business web applications",
    start_url: "/",
    display: "standalone",
    background_color: "#08090c",
    theme_color: "#08090c",
    icons: [],
  };
}
