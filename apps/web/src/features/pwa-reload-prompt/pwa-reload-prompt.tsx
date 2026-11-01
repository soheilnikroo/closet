import { useTranslation } from "react-i18next";
import { useRegisterSW } from "virtual:pwa-register/react";

import { Button } from "@/shared/ui";

export function PwaReloadPrompt() {
  const { t } = useTranslation();
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
  });

  if (!needRefresh) {
    return null;
  }

  return (
    <div
      role="status"
      className="fixed inset-x-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] z-50 mx-auto max-w-md rounded-2xl bg-inverse-surface p-4 text-inverse-on-surface shadow-elevation-3 sm:inset-x-auto sm:start-auto sm:end-4"
    >
      <p className="text-sm font-medium">{t("pwa.updateAvailable")}</p>
      <p className="mt-1 text-xs opacity-80">{t("pwa.updateHint")}</p>
      <div className="mt-3 flex gap-2">
        <Button
          size="sm"
          variant="tonal"
          onClick={() => {
            void updateServiceWorker(true);
          }}
        >
          {t("pwa.reload")}
        </Button>
        <Button
          size="sm"
          variant="text"
          className="text-inverse-on-surface"
          onClick={() => {
            setNeedRefresh(false);
          }}
        >
          {t("pwa.dismiss")}
        </Button>
      </div>
    </div>
  );
}
