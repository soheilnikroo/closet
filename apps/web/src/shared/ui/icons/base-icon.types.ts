import type { ReactNode } from "react";

import type { IconProps } from "@/shared/ui/icons/icon.types.js";

export type BaseIconProps = IconProps & {
  children: ReactNode;
};
