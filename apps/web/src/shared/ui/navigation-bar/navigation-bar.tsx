import { motion } from "motion/react";
import { NavLink } from "react-router";

import { cn, navIndicator } from "@/shared/lib";

import type { NavigationBarProps } from "./navigation-bar.types.js";

export function NavigationBar({ items, className }: NavigationBarProps) {
  return (
    <nav
      aria-label="Primary"
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t border-outline-variant/60 bg-surface-container/95 backdrop-blur-md",
        "pb-[env(safe-area-inset-bottom,0px)]",
        className,
      )}
    >
      <ul className="mx-auto grid max-w-lg grid-cols-3 px-2 pt-1">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "relative flex min-h-14 min-w-11 touch-manipulation select-none flex-col items-center justify-center gap-1 rounded-xl px-2 text-xs font-medium transition-colors",
                  isActive ? "text-on-secondary-container" : "text-on-surface-variant",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className="relative flex h-8 w-14 items-center justify-center">
                    {isActive ? (
                      <motion.span
                        className="absolute inset-0 rounded-full bg-secondary-container"
                        layoutId={navIndicator.layoutId}
                        transition={navIndicator.transition}
                      />
                    ) : null}
                    <span className="relative z-10 size-6">{item.icon}</span>
                  </span>
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
