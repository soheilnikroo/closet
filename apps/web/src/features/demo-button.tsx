import { useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { useApiClient } from "@/shared/hooks";
import { Button } from "@/shared/ui";

export function DemoButton() {
  const api = useApiClient();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [busy, startTransition] = useTransition();
  const [error, setError] = useState("");
  return (
    <div className="px-6 pb-3">
      <Button
        fullWidth
        variant="tonal"
        disabled={busy}
        onClick={() =>
          startTransition(async () => {
            setError("");
            try {
              await api.seedDemo();
              await navigate("/today");
            } catch (err) {
              setError(err instanceof Error ? err.message : t("common.error"));
            }
          })
        }
      >
        {busy ? t("experience.loading") : t("experience.demoButton")}
      </Button>
      <p role="alert" className="mt-2 text-sm text-error empty:hidden">
        {error}
      </p>
    </div>
  );
}
