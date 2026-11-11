/* oxlint-disable jsx-a11y/anchor-is-valid -- React Router Link uses to for navigation. */
import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";

import { LocaleSwitcher } from "@/features/locale-switcher";
import { useApiClient } from "@/shared/hooks";
import { Button, TextField } from "@/shared/ui";
import { ClosetBrand } from "@/shared/ui/closet-brand.js";

export function AuthWelcome({ signup, children }: { signup: boolean; children: ReactNode }) {
  const { t } = useTranslation();
  return (
    <main className="mx-auto min-h-dvh w-full max-w-lg px-5 pt-[calc(1rem+env(safe-area-inset-top,0px))] pb-[calc(2rem+env(safe-area-inset-bottom,0px))]">
      <header className="flex items-center justify-between">
        <Link
          to="/"
          className="md-state-layer flex min-h-12 items-center rounded-full px-3 font-display text-lg text-primary"
        >
          <ClosetBrand label={t("brand")} />
        </Link>
        <LocaleSwitcher />
      </header>
      <section className="pt-7 pb-6">
        <p className="md-label-large text-primary">{t("welcomeAuth.eyebrow")}</p>
        <h1 className="md-headline-large mt-3 font-display">
          {t(signup ? "welcomeAuth.join" : "welcomeAuth.back")}{" "}
          <span aria-hidden="true" className="friendly-wave">
            {signup ? "✨" : "👋"}
          </span>
        </h1>
        <p className="md-body-large mt-3 text-on-surface-variant">
          {t(signup ? "welcomeAuth.joinHint" : "welcomeAuth.backHint")}
        </p>
      </section>
      {children}
      <p className="md-body-medium mt-6 text-center text-on-surface-variant">
        {t("welcomeAuth.footer")}
      </p>
    </main>
  );
}

/** Local mock mode never asks for a password or pretends to create a real account. */
export function DemoWelcome({ signup, redirectTo }: { signup: boolean; redirectTo: string }) {
  const { t } = useTranslation();
  const api = useApiClient();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function enter() {
    if (busy) {
      return;
    }
    setBusy(true);
    setError("");
    try {
      if (name.trim()) {
        await api.updateMe({ displayName: name.trim() });
      }
      await navigate(redirectTo);
    } catch {
      setError(t("common.error"));
    } finally {
      setBusy(false);
    }
  }
  return (
    <AuthWelcome signup={signup}>
      <form
        className="space-y-5 py-5"
        onSubmit={(event) => {
          event.preventDefault();
          void enter();
        }}
      >
        <div>
          <p className="md-title-medium">{t("welcomeAuth.demoTitle")}</p>
          <p className="md-body-medium mt-2 text-on-surface-variant">{t("welcomeAuth.demoHint")}</p>
        </div>
        <TextField
          label={t("welcomeAuth.name")}
          autoComplete="given-name"
          maxLength={80}
          value={name}
          onChange={(event) => setName(event.target.value)}
          supportingText={t("welcomeAuth.nameHint")}
        />
        <p role="alert" className="text-error empty:hidden">
          {error}
        </p>
        <Button type="submit" fullWidth size="lg" disabled={busy}>
          {t(busy ? "welcomeAuth.opening" : "welcomeAuth.explore")}
        </Button>
      </form>
    </AuthWelcome>
  );
}
