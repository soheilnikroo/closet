import { BaseIcon } from "./base-icon.js";
import type { IconProps } from "./icon.types.js";

export function DiscoverIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m10.2 13.8 1-4.2 4.2-1-1 4.2z" />
    </BaseIcon>
  );
}
