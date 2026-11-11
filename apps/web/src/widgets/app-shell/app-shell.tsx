import { useState, useLayoutEffect, useRef, ViewTransition } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";

import { LocaleSwitcher } from "@/features/locale-switcher";
import { StylistChatSheet } from "@/features/stylist-chat-sheet";
import { UserAuthControls } from "@/features/user-auth-controls";
import { Button } from "@/shared/ui";
import {
  ClosetIcon,
  DiscoverIcon,
  NavigationBar,
  SkipLink,
  TodayIcon,
  TopAppBar,
} from "@/shared/ui";
import type { AppShellProps } from "@/widgets/app-shell/app-shell.types.js";

/**
 * Compact-window M3 app scaffold: top app bar + scrollable body + navigation bar.
 * Edge-to-edge with safe-area padding; 100dvh shell like a native activity.
 */
const scrollPositions = new Map<string, number>();

export function AppShell({ title, children }: AppShellProps) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const main = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const node = main.current;
    if (!node) {
      return undefined;
    }
    node.scrollTop = scrollPositions.get(pathname) ?? 0;
    return () => {
      scrollPositions.set(pathname, node.scrollTop);
    };
  }, [pathname]);
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="mx-auto flex h-dvh w-full max-w-lg flex-col overflow-hidden overscroll-none bg-surface">
      <SkipLink label={t("a11y.skipToContent")} />
      <TopAppBar
        title={title}
        trailing={
          <div className="flex items-center gap-0.5">
            <Button variant="tonal" size="sm" onClick={() => setChatOpen(true)}>
              {t("experience.askStylist")}
            </Button>
            <LocaleSwitcher />
            <UserAuthControls />
          </div>
        }
      />
      <ViewTransition name="app-page" default="page-transition">
        <main
          ref={main}
          id="main-content"
          tabIndex={-1}
          className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 pt-2 pb-3 outline-none"
          style={{
            paddingBottom: "calc(5rem + env(safe-area-inset-bottom, 0px) + 0.75rem)",
          }}
        >
          {children}
        </main>
      </ViewTransition>
      {chatOpen ? <StylistChatSheet open={chatOpen} onClose={() => setChatOpen(false)} /> : null}
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
          {
            to: "/collections",
            label: t("collections.nav"),
            icon: (
              <svg
                viewBox="0 0 24 24"
                className="size-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path d="M6 3h12v18l-6-4-6 4V3Z" />
              </svg>
            ),
          },
          {
            to: "/settings",
            label: t("experience.settings"),
            icon: (
              <svg
                viewBox="0 0 24 24"
                className="size-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 21v-3a7 7 0 0 1 14 0v3" />
              </svg>
            ),
          },
        ]}
      />
    </div>
  );
}
