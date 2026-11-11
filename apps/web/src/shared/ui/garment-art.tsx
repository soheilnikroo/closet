import { useGarmentImage } from "@/shared/hooks/use-garment-image.js";

type Props = { slot: string; color?: string; imageUrl?: string | null; className?: string };
const colors: Record<string, string> = {
  white: "#faf9ef",
  black: "#323934",
  navy: "#384d67",
  blue: "#92b0c4",
  indigo: "#536987",
  beige: "#ccbea0",
  charcoal: "#636965",
  grey: "#9ca09b",
  olive: "#8d9876",
  brown: "#9e7a5e",
  green: "#7da184",
  red: "#c18276",
  pink: "#d4a5ac",
};
const shapes: Record<string, string> = {
  top: "M32 25 45 19Q50 28 55 19L68 25 83 47 69 55 64 45 67 88H33L36 45 31 55 17 47Z",
  bottom: "M32 20H68L73 90H53L50 49 47 90H27Z",
  shoes: "M20 48Q35 53 40 39L55 40 60 60 83 67Q92 81 77 84H20Q10 80 14 66Z",
  outerwear: "M32 25 45 19 50 28 55 19 68 25 83 65 70 70 64 45 67 88H33L36 45 30 70 17 65Z",
  accessory: "M32 20H65L56 61 70 88 51 94 38 65 25 83 17 72 38 43Z",
  one_piece: "M36 20 45 17Q50 26 55 17L64 20 60 45 80 90H20L40 45Z",
};
export function GarmentArt({ slot, color = "green", imageUrl, className = "" }: Props) {
  const { source, observe } = useGarmentImage(imageUrl);
  if (source) {
    return (
      <img
        ref={observe}
        src={source}
        alt=""
        loading="lazy"
        decoding="async"
        width={320}
        height={320}
        className={`aspect-square w-full object-contain ${className}`}
      />
    );
  }
  return (
    <svg
      ref={observe}
      viewBox="0 0 100 110"
      aria-hidden="true"
      className={`aspect-square w-full ${className}`}
    >
      <ellipse cx="50" cy="96" rx="29" ry="4" fill="currentColor" opacity=".07" />
      <path
        d={shapes[slot] ?? shapes.top}
        fill={colors[color.toLowerCase()] ?? colors.green}
        stroke="currentColor"
        strokeOpacity=".35"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M45 20 50 29 55 20" fill="none" stroke="currentColor" strokeOpacity=".25" />
    </svg>
  );
}
