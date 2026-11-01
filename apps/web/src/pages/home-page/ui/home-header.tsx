import { SignedIn } from "@clerk/clerk-react";
import { motion } from "motion/react";

import { LocaleSwitcher } from "@/features/locale-switcher";
import { UserAuthControls } from "@/features/user-auth-controls";
import type { HomeHeaderProps } from "@/pages/home-page/ui/home-header.types.js";
import { softSpring } from "@/shared/lib";

export function HomeHeader({ brand, clerkEnabled }: HomeHeaderProps) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-3 px-5 pt-[max(1rem,env(safe-area-inset-top,0px))] pb-2">
      <motion.p
        className="md-title-large text-primary"
        style={{ viewTransitionName: "app-brand" }}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={softSpring}
      >
        {brand}
      </motion.p>
      <div className="flex items-center gap-1">
        <LocaleSwitcher />
        {clerkEnabled ? (
          <SignedIn>
            <UserAuthControls />
          </SignedIn>
        ) : null}
      </div>
    </header>
  );
}
