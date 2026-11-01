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
        "fixed inset-x-0 bottom-0 z-30 bg-surface-container",
        "pb-[env(safe-area-inset-bottom,0px)]",
        className,
      )}
      style={{ viewTransitionName: "app-nav" }}
    >
      <ul className="mx-auto grid h-20 max-w-lg grid-cols-3">
        {items.map((item) => (
          <li key={item.to} className="min-w-0">
            <NavLink
              to={item.to}
              viewTransition
              className={({ isActive }) =>
                cn(
                  "md-state-layer relative flex h-full min-h-12 touch-manipulation select-none flex-col items-center justify-center gap-1 px-2",
                  isActive ? "text-on-secondary-container" : "text-on-surface-variant",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className="relative flex h-8 w-16 items-center justify-center">
                    {isActive ? (
                      <motion.span
                        className="absolute inset-x-0 inset-y-0 rounded-full bg-secondary-container"
                        layoutId={navIndicator.layoutId}
                        transition={navIndicator.transition}
                      />
                    ) : null}
                    <span
                      className={cn(
                        "relative z-10 size-6 transition-transform duration-100",
                        isActive && "scale-105",
                      )}
                    >
                      {item.icon}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "relative z-10 md-label-medium max-w-full truncate",
                      isActive ? "text-secondary" : "text-on-surface-variant",
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
