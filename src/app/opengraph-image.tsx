import { ImageResponse } from "next/og";

export const alt = "Nitin Chavan - full stack developer portfolio";
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
        <span>BUILDING</span>
        <span style={{ color: "#8cb4ff" }}>WEB</span>
        <span>APPLICATIONS.</span>
      </div>
      <div style={{ display: "flex", color: "#9299aa", fontSize: 25 }}>
        React.js - Node.js - Express.js - PostgreSQL
      </div>
    </div>,
    size,
  );
}
