import { motion } from "motion/react";
import { NavLink } from "react-router";

import { cn, navIndicator } from "@/shared/lib";
import type { NavigationBarProps } from "@/shared/ui/navigation-bar/navigation-bar.types.js";

/**
 * Material 3 navigation bar — full-bleed surface-container, active indicator pill,
 * label-medium, 80dp + safe-area. View Transitions on tab changes.
 */
export function NavigationBar({ items, className }: NavigationBarProps) {
  return (
    <nav
      aria-label="Primary"
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 border-t border-outline-variant/50 bg-surface-container-lowest",
        "pb-[env(safe-area-inset-bottom,0px)]",
        className,
      )}
      style={{ viewTransitionName: "app-nav" }}
    >
      <ul className="mx-auto grid h-20 max-w-lg auto-cols-fr grid-flow-col">
        {items.map((item) => (
          <li key={item.to} className="min-w-0">
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "md-state-layer relative flex h-full min-h-12 touch-manipulation select-none flex-col items-center justify-center gap-1 px-2",
                  isActive ? "text-on-secondary-container" : "text-on-surface-variant",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className="relative flex h-8 w-14 items-center justify-center">
                    {isActive ? (
                      <motion.span
                        className="absolute inset-x-0 inset-y-0 rounded-full bg-primary"
                        layoutId={navIndicator.layoutId}
                        transition={navIndicator.transition}
                      />
                    ) : null}
                    <span
                      className={cn(
                        "relative z-10 size-6 transition-transform duration-100",
                        isActive && "scale-105 text-on-primary",
                      )}
                    >
                      {item.icon}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "relative z-10 md-label-medium max-w-full truncate",
                      isActive ? "font-semibold text-primary" : "text-on-surface-variant",
                    )}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
