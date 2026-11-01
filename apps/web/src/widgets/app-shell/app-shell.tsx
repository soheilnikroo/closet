import { useTranslation } from "react-i18next";

import { LocaleSwitcher } from "@/features/locale-switcher";
import { UserAuthControls } from "@/features/user-auth-controls";
import {
  ClosetIcon,
  DiscoverIcon,
  NavigationBar,
  SkipLink,
  TodayIcon,
  TopAppBar,
} from "@/shared/ui";

import type { AppShellProps } from "./app-shell.types.js";

/**
 * Compact-window M3 app scaffold: top app bar + scrollable body + navigation bar.
 * Edge-to-edge with safe-area padding; 100dvh shell like a native activity.
 */
export function AppShell({ title, children }: AppShellProps) {
  const { t } = useTranslation();

  return (
    <div className="mx-auto flex h-dvh w-full max-w-lg flex-col overflow-hidden overscroll-none bg-surface">
      <SkipLink label={t("a11y.skipToContent")} />
      <TopAppBar
        title={title}
        trailing={
          <div className="flex items-center gap-0.5">
            <LocaleSwitcher />
            <UserAuthControls />
          </div>
        }
      />
      <main
        id="main-content"
        tabIndex={-1}
        className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 pt-2 pb-3 outline-none"
        style={{
          paddingBottom: "calc(5rem + env(safe-area-inset-bottom, 0px) + 0.75rem)",
        }}
      >
        {children}
      </main>
      <NavigationBar
        items={[
          {
            to: "/today",
            label: t("nav.today"),
            icon: <TodayIcon className="size-6" />,
          },
          {
            to: "/closet",
            label: t("nav.closet"),
            icon: <ClosetIcon className="size-6" />,
          },
          {
            to: "/discover",
            label: t("nav.discover"),
            icon: <DiscoverIcon className="size-6" />,
          },
        ]}
      />
    </div>
  );
}
