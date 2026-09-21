import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nitin Chavan - Full Stack Developer Portfolio",
    short_name: "NC",
    description:
      "Portfolio of Nitin Chavan, a full stack developer with 2+ years of experience in React.js, Node.js, PostgreSQL, REST APIs, dashboards, admin panels, and business web applications",
    start_url: "/",
    display: "standalone",
    background_color: "#071016",
    theme_color: "#071016",
    icons: [],
  };
}
