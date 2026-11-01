import { BaseIcon } from "@/shared/ui/icons/base-icon.js";
import type { IconProps } from "@/shared/ui/icons/icon.types.js";

export function ClosetIcon(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M5 4h14v16H5z" />
      <path d="M12 4v16M9.5 11.5h.01" />
    </BaseIcon>
  );
}
