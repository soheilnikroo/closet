export const motionDurations = {
  short1: 0.05,
  short2: 0.1,
  short3: 0.15,
  short4: 0.2,
  medium1: 0.25,
  medium2: 0.3,
  medium3: 0.35,
  medium4: 0.4,
  long1: 0.45,
  long2: 0.5,
} as const;

export const motionEasings = {
  standard: [0.2, 0, 0, 1] as const,
  emphasized: [0.2, 0, 0, 1] as const,
  emphasizedDecelerate: [0.05, 0.7, 0.1, 1] as const,
  emphasizedAccelerate: [0.3, 0, 0.8, 0.15] as const,
} as const;

export const softSpring = {
  type: "spring" as const,
  stiffness: 520,
  damping: 32,
  mass: 0.8,
};

export const snappySpring = {
  type: "spring" as const,
  stiffness: 640,
  damping: 36,
  mass: 0.7,
};

export const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: {
    duration: motionDurations.medium2,
    ease: motionEasings.emphasizedDecelerate,
  },
} as const;

export const scaleTap = {
  whileTap: { scale: 0.98 },
  transition: softSpring,
} as const;

export const pressableCard = {
  whileHover: { y: -2, transition: softSpring },
  whileTap: { scale: 0.985, transition: snappySpring },
} as const;

export const staggerContainer = {
  initial: "hidden",
  animate: "show",
  variants: {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.055, delayChildren: 0.04 },
    },
  },
} as const;

export const staggerItem = {
  variants: {
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: motionDurations.medium1,
        ease: motionEasings.emphasizedDecelerate,
      },
    },
  },
} as const;

export const navIndicator = {
  layoutId: "bottom-nav-indicator",
  transition: {
    type: "spring" as const,
    stiffness: 460,
    damping: 34,
  },
};
