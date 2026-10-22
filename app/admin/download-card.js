export function downloadCardImage(message, category, id, style) {
  const esc = (v) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const palettes = { violet: ["#17102f", "#6d42d8", "#d7c7ff"], crimson: ["#310d1c", "#b6294e", "#ffd1dd"], ice: ["#071c2a", "#227fa0", "#bdefff"], gold: ["#2a1c08", "#a77921", "#ffe5a0"], emerald: ["#09261e", "#238768", "#b8ffe0"], rose: ["#2c101e", "#a84470", "#ffd0e7"] };
  const [base, glow, accent] = palettes[style] || palettes.violet;
  const lines = []; let line = "";
  for (const word of String(message ?? "").split(/\s+/)) {
    const next = line ? line + " " + word : word;
    if (next.length > 28 && line) { lines.push(line); line = word; } else line = next;
  }
  if (line) lines.push(line);
  const shown = lines.slice(0, 15);
  const y = 690 - (shown.length - 1) * 27;
  const text = shown.map((v, i) => '<text x="600" y="' + (y + i * 54) + '" text-anchor="middle" class="msg">' + esc(v) + '</text>').join("");
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1600" viewBox="0 0 1200 1600"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="' + base + '"/><stop offset="1" stop-color="#05060b"/></linearGradient><radialGradient id="glow"><stop stop-color="' + glow + '" stop-opacity=".65"/><stop offset="1" stop-color="' + glow + '" stop-opacity="0"/></radialGradient><style>.brand{font:bold 28px Arial;letter-spacing:8px;fill:#fff}.small{font:600 16px Arial;letter-spacing:5px;fill:' + accent + '}.msg{font:500 35px Arial;fill:#fff}.orn{font:26px Arial;fill:' + accent + ';letter-spacing:8px}</style></defs><rect width="1200" height="1600" rx="40" fill="url(#bg)"/><circle cx="600" cy="620" r="580" fill="url(#glow)"/><rect x="28" y="28" width="1144" height="1544" rx="28" fill="none" stroke="' + accent + '" stroke-width="2"/><rect x="52" y="52" width="1096" height="1496" rx="20" fill="none" stroke="' + accent + '" stroke-opacity=".25"/><text x="600" y="130" text-anchor="middle" class="brand">EMP EXCLUSIVE</text><path d="M140 170H1060" stroke="' + accent + '" stroke-opacity=".6"/><text x="600" y="225" text-anchor="middle" class="small">EMP UNKNOWN · ANONYMOUS TRANSMISSION</text><rect x="100" y="320" width="1000" height="780" rx="26" fill="#05060b" fill-opacity=".38" stroke="' + accent + '" stroke-opacity=".35"/><text x="600" y="430" text-anchor="middle" class="small">' + esc(category).toUpperCase() + '</text>' + text + '<text x="600" y="1230" text-anchor="middle" class="orn">✦ ✧ EMP ✧ ✦</text><path d="M140 1320H1060" stroke="' + accent + '" stroke-opacity=".6"/><text x="600" y="1390" text-anchor="middle" class="small">TRANSMISSION #' + esc(id) + '</text><text x="600" y="1460" text-anchor="middle" font-family="Arial" font-size="14" letter-spacing="5" fill="#a7a7b5">YOUR WORDS. YOUR MOMENT. EMP UNKNOWN.</text></svg>';
  const svgUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 2400;
    canvas.height = 3200;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#05060b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) {
        URL.revokeObjectURL(svgUrl);
        return;
      }
      const jpgUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = jpgUrl;
      a.download = "EMP-UNKNOWN-card-" + id + ".jpg";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(jpgUrl), 1500);
      URL.revokeObjectURL(svgUrl);
    }, "image/jpeg", 0.95);
  };
  img.onerror = () => URL.revokeObjectURL(svgUrl);
  img.src = svgUrl;
}
