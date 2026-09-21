import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} - Full Stack Developer portfolio preview`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background:
          "radial-gradient(circle at 76% 30%, rgba(77, 240, 176, 0.18), transparent 28%), radial-gradient(circle at 18% 92%, rgba(121, 168, 255, 0.14), transparent 24%), #071016",
        color: "#f4f6fb",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", color: "#64f1c0", fontSize: 24 }}>
        NITIN CHAVAN / REACT.JS / NODE.JS / POSTGRESQL
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 108,
          fontWeight: 800,
          letterSpacing: "-7px",
          lineHeight: 0.86,
        }}
      >
        <span>FULL STACK</span>
        <span style={{ color: "#64f1c0" }}>PRODUCT WEB</span>
        <span>APPS.</span>
      </div>
      <div style={{ display: "flex", color: "#b8c7d6", fontSize: 25 }}>
        2+ years building HRMS, payroll, admin panels, REST APIs and clean UI systems
      </div>
    </div>,
    size,
  );
}
