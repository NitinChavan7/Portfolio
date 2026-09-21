import { ImageResponse } from "next/og";

export const alt = "Nitin Chavan - Full Stack Developer with 2+ years of experience";
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
        background: "#08090c",
        color: "#f4f6fb",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", color: "#a6ffcb", fontSize: 24 }}>
        NITIN CHAVAN / FULL STACK DEVELOPER
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
        <span style={{ color: "#8cb4ff" }}>PRODUCT</span>
        <span>DELIVERY.</span>
      </div>
      <div style={{ display: "flex", color: "#9299aa", fontSize: 25 }}>
        2+ years - React.js - Node.js - PostgreSQL
      </div>
    </div>,
    size,
  );
}
