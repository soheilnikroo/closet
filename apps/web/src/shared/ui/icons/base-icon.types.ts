import type { ReactNode } from "react";

import type { IconProps } from "./icon.types.js";

export type BaseIconProps = IconProps & {
  children: ReactNode;
};
