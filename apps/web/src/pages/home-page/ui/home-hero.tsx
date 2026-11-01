import { motion } from "motion/react";

import type { HomeHeroProps } from "@/pages/home-page/ui/home-hero.types.js";
import { fadeUp } from "@/shared/lib";
import { AnimatedScene } from "@/shared/ui";

export function HomeHero({ tagline, title, subtitle, brand }: HomeHeroProps) {
  return (
    <motion.main
      id="main-content"
      tabIndex={-1}
      className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain px-5 outline-none"
      {...fadeUp}
    >
      <div className="flex flex-1 flex-col justify-center py-4">
        <p className="md-label-medium tracking-[0.1em] text-on-surface-variant uppercase">
          {tagline}
        </p>
        <h1 className="mt-3 max-w-[12ch] font-display text-[2.25rem] leading-[1.15] font-medium text-on-surface">
          {title}
        </h1>
        <p className="md-body-medium mt-3 max-w-[36ch] text-on-surface-variant">{subtitle}</p>

        <div className="mt-10 flex justify-center">
          <AnimatedScene variant="closetEmpty" className="w-44" label={brand} />
        </div>
      </div>
    </motion.main>
  );
}
