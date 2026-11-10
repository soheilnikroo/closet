const NAMED_COLORS: Record<string, string> = {
  white: "#f4f7f2",
  black: "#1c1c1c",
  blue: "#3d6fbf",
  navy: "#1e3a5f",
  red: "#b42318",
  green: "#2f6a3a",
  beige: "#e6d3b3",
  brown: "#7a5230",
  grey: "#8a918a",
  gray: "#8a918a",
  pink: "#e7a0b4",
  yellow: "#e2c15a",
  orange: "#c46521",
  cream: "#f3ead7",
  olive: "#6b7340",
};

export function clothingColor(name: string): string {
  const key = name.trim().toLowerCase();
  return NAMED_COLORS[key] ?? "#d7e3d4";
}
