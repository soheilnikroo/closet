import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useLocation } from "react-router";

import { useOffline, useOfflineOnly } from "@/shared/lib/offline/offline-context.js";

export function OfflineBoundary({ children }: { children: ReactNode }) {
  const offlineOnly = useOfflineOnly();
  const { pathname } = useLocation();
  if (
    offlineOnly &&
    (pathname === "/" || pathname.startsWith("/sign-") || pathname.startsWith("/sso"))
  ) {
    return <Navigate to="/today" replace />;
  }
  return children;
}
export function OfflineStatus() {
  const offline = useOffline();
  const { t } = useTranslation();
  if (!offline) {
    return null;
  }
  return (
    <div
      role="status"
      className="fixed inset-x-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] z-40 mx-auto max-w-md rounded-2xl bg-inverse-surface px-4 py-3 text-sm text-inverse-on-surface shadow-elevation-2"
    >
      {t("pwa.offlineBrowsing")}
    </div>
  );
}
