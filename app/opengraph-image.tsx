import { ImageResponse } from "next/og";
export const alt = "EMP UNKNOWN — Send an anonymous message to EMP";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "radial-gradient(ellipse at 50% 40%, #202538 0%, #090a10 48%, #030406 100%)", color: "white", fontFamily: "Arial, sans-serif", position: "relative" }}>
      <div style={{ position: "absolute", inset: 24, border: "1px solid #777d8c", borderRadius: 24, display: "flex" }} />
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundImage: "repeating-linear-gradient(125deg, transparent 0 130px, rgba(255,30,65,.12) 131px, transparent 134px 260px, rgba(45,115,255,.12) 261px, transparent 264px 390px)", display: "flex" }} />
      <div style={{ display: "flex", fontSize: 25, fontWeight: 800, letterSpacing: 12, color: "#d9dbe3", marginBottom: 34 }}>EMP EXCLUSIVE</div>
      <div style={{ display: "flex", fontSize: 100, fontWeight: 900, letterSpacing: -5, lineHeight: 1 }}>EMP <span style={{ color: "#b7bdcb", marginLeft: 22 }}>UNKNOWN</span></div>
      <div style={{ display: "flex", fontSize: 26, color: "#c4c6d0", marginTop: 35 }}>PRIVATE WORDS. UNKNOWN VOICES.</div>
      <div style={{ display: "flex", fontSize: 17, color: "#818796", marginTop: 16 }}>Send an anonymous message to EMP and wait for a review.</div>
    </div>,
    size
  );
}