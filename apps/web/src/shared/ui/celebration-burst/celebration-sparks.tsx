import { motion } from "motion/react";

import { CELEBRATION_SPARK_COUNT } from "@/shared/ui/celebration-burst/celebration-burst.constants.js";

export function CelebrationSparks() {
  return (
    <>
      {Array.from({ length: CELEBRATION_SPARK_COUNT }, (_, index) => {
        const angle = (index / CELEBRATION_SPARK_COUNT) * Math.PI * 2 - Math.PI / 2;
        const distance = 54 + (index % 2) * 10;
        return (
          <motion.span
            key={index}
            className="absolute size-1.5 rounded-full bg-primary"
            initial={{ x: 0, y: 0, opacity: 0.9, scale: 0.6 }}
            animate={{
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
              opacity: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.7,
              ease: [0.05, 0.7, 0.1, 1],
              delay: 0.05 + index * 0.03,
            }}
          />
        );
      })}
    </>
  );
}
