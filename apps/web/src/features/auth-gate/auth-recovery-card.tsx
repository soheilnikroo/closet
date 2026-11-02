import type { AuthRecoveryCardProps } from "@/features/auth-gate/auth-recovery-card.types.js";
import { Button, Card } from "@/shared/ui";

export function AuthRecoveryCard({
  title,
  body,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
}: AuthRecoveryCardProps) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-lg items-center px-4">
      <Card elevated className="w-full space-y-4">
        <h1 className="font-display text-2xl font-semibold text-on-surface">{title}</h1>
        <p className="text-sm leading-relaxed text-on-surface-variant">{body}</p>
        <div className="flex flex-col gap-2">
          <Button fullWidth size="lg" onClick={onPrimary}>
            {primaryLabel}
          </Button>
          <Button fullWidth variant="text" onClick={onSecondary}>
            {secondaryLabel}
          </Button>
        </div>
      </Card>
    </div>
  );
}
