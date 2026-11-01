import type { AnimatedSceneMotionProps } from "@/shared/ui/animated-scene/animated-scene-motion.types.js";
import { ClosetEmptyScene } from "@/shared/ui/animated-scene/closet-empty-scene.js";

export function WelcomeScene({ reduceMotion }: AnimatedSceneMotionProps) {
  return <ClosetEmptyScene reduceMotion={reduceMotion} />;
}
