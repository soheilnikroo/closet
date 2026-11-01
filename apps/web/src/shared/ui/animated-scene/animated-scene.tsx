import { motion, useReducedMotion } from "motion/react";

import { cn, softSpring } from "@/shared/lib";

import type { AnimatedSceneProps } from "./animated-scene.types.js";

/**
 * Calm brand illustrations — soft green palette via CSS variables, gentle motion only.
 */
export function AnimatedScene({ variant, className, label }: AnimatedSceneProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={cn("relative mx-auto aspect-square w-40 max-w-full", className)}
      role="img"
      aria-label={label}
    >
      <svg viewBox="0 0 200 200" className="size-full overflow-visible" aria-hidden>
        <defs>
          <linearGradient id="sceneGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--md-sys-color-primary-container)" />
            <stop offset="100%" stopColor="var(--md-sys-color-tertiary-container)" />
          </linearGradient>
        </defs>

        <motion.circle
          cx="100"
          cy="100"
          r="76"
          fill="url(#sceneGlow)"
          initial={reduceMotion ? false : { opacity: 0.55, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={softSpring}
        />

        {variant === "wardrobeEmpty" ? (
          <WardrobeEmpty reduceMotion={Boolean(reduceMotion)} />
        ) : null}
        {variant === "welcome" ? <WelcomeScene reduceMotion={Boolean(reduceMotion)} /> : null}
        {variant === "balanced" ? <BalancedScene reduceMotion={Boolean(reduceMotion)} /> : null}
        {variant === "stylist" ? <StylistScene reduceMotion={Boolean(reduceMotion)} /> : null}
      </svg>
    </div>
  );
}

function WardrobeEmpty({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <g>
      {/* Rail */}
      <motion.line
        x1="56"
        y1="58"
        x2="144"
        y2="58"
        stroke="var(--md-sys-color-outline)"
        strokeWidth="3"
        strokeLinecap="round"
        initial={reduceMotion ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.45, ease: [0.05, 0.7, 0.1, 1] }}
      />
      {/* Hangers + garments */}
      {[0, 1, 2].map((index) => {
        const x = 70 + index * 30;
        return (
          <g key={index}>
            <motion.path
              d={`M${x} 58 v10`}
              stroke="var(--md-sys-color-outline-variant)"
              strokeWidth="2"
              strokeLinecap="round"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 + index * 0.06 }}
            />
            <motion.path
              d={`M${x - 12} 70 q12 -10 24 0`}
              fill="none"
              stroke="var(--md-sys-color-secondary)"
              strokeWidth="2.5"
              strokeLinecap="round"
              initial={reduceMotion ? false : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...softSpring, delay: 0.12 + index * 0.06 }}
            />
            <motion.rect
              x={x - 14}
              y={74}
              width="28"
              height={36 + index * 4}
              rx="6"
              fill={
                index === 1
                  ? "var(--md-sys-color-primary)"
                  : "var(--md-sys-color-primary-container)"
              }
              initial={reduceMotion ? false : { y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...softSpring, delay: 0.16 + index * 0.07 }}
            />
          </g>
        );
      })}
      <motion.circle
        cx="100"
        cy="148"
        r="3"
        fill="var(--md-sys-color-tertiary)"
        animate={reduceMotion ? undefined : { opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
    </g>
  );
}

function WelcomeScene({ reduceMotion }: { reduceMotion: boolean }) {
  return <WardrobeEmpty reduceMotion={reduceMotion} />;
}

function BalancedScene({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <g>
      {[0, 1, 2].map((index) => (
        <motion.rect
          key={index}
          x={58 + index * 28}
          y={68}
          width="20"
          height={52 + index * 4}
          rx="6"
          fill={
            index === 1 ? "var(--md-sys-color-primary)" : "var(--md-sys-color-primary-container)"
          }
          initial={reduceMotion ? false : { y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ...softSpring, delay: index * 0.07 }}
        />
      ))}
      <path
        d="M56 140h88"
        stroke="var(--md-sys-color-outline-variant)"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </g>
  );
}

function StylistScene({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <g>
      <motion.circle
        cx="100"
        cy="96"
        r="32"
        fill="var(--md-sys-color-surface-container-lowest)"
        stroke="var(--md-sys-color-tertiary)"
        strokeWidth="3"
        animate={reduceMotion ? undefined : { scale: [1, 1.03, 1] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M88 96h24M100 84v24"
        stroke="var(--md-sys-color-primary)"
        strokeWidth="4"
        strokeLinecap="round"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      />
      {!reduceMotion
        ? [0, 1, 2].map((index) => {
            const angle = -Math.PI / 2 + (index / 3) * Math.PI * 2;
            return (
              <motion.circle
                key={index}
                cx={100 + Math.cos(angle) * 48}
                cy={96 + Math.sin(angle) * 48}
                r="3.5"
                fill="var(--md-sys-color-primary)"
                animate={{ opacity: [0.25, 0.9, 0.25] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.25 }}
              />
            );
          })
        : null}
    </g>
  );
}
