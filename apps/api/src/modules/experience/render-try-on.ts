const colors: Record<string, string> = {
  black: "#303332",
  white: "#faf9f1",
  navy: "#35465e",
  blue: "#759cb4",
  indigo: "#485b83",
  beige: "#cabea7",
  grey: "#969a96",
  charcoal: "#535853",
  olive: "#7c8967",
  brown: "#876951",
  green: "#659275",
  red: "#b96b61",
};

export function renderTryOn(
  entries: Array<{ role: string; item: { primaryColor: string } }>,
  silhouette: "straight" | "relaxed",
): string {
  const color = (role: string) =>
    colors[entries.find((entry) => entry.role === role)?.item.primaryColor.toLowerCase() ?? ""] ??
    "#a9b7a3";
  const width = silhouette === "relaxed" ? "1.12" : "1";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 440"><rect width="320" height="440" rx="32" fill="#f0f4ea"/><ellipse cx="160" cy="412" rx="70" ry="10" fill="#dbe3d5"/><g transform="translate(160 0) scale(${width} 1) translate(-160 0)"><circle cx="160" cy="65" r="28" fill="#cbd5c5"/><path d="M147 88H173V112H147Z" fill="#cbd5c5"/><path d="M122 216H198L203 390H170L160 282 150 390H117Z" fill="${color("bottom")}" stroke="#59634f" stroke-width="2"/><path d="M120 108 145 99Q160 114 175 99L200 108 229 204 204 213 190 163 199 238H121L130 163 116 213 91 204Z" fill="${color("top")}" stroke="#59634f" stroke-width="2"/>${entries.some((e) => e.role === "outerwear") ? `<path d="M120 108 145 99 154 131 150 247H118L128 163 115 224 87 215Z M200 108 175 99 166 131 170 247H202L192 163 205 224 233 215Z" fill="${color("outerwear")}" stroke="#59634f" stroke-width="2"/>` : ""}<path d="M117 385H150V405H104Q100 392 117 385ZM170 385H203Q220 392 216 405H170Z" fill="${color("shoes")}" stroke="#59634f" stroke-width="2"/></g></svg>`;
}
