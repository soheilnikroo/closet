import { BaseIcon } from "@/shared/ui/icons/base-icon.js";
import type { IconProps } from "@/shared/ui/icons/icon.types.js";

export function TodayIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M8 3.5v3M16 3.5v3M3.5 10h17" />
    </BaseIcon>
  );
}
