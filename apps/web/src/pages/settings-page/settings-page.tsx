import { preferencesSchema, fitPreferenceSchema } from "@closet/shared";
import type { City, Preferences, StyleProfile, UserProfile, StyleTag } from "@closet/shared";
import { useEffect, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";

import { UserAuthControls } from "@/features/user-auth-controls";
import { isClerkEnabled } from "@/shared/config";
import { useApiClient } from "@/shared/hooks";
import { changeLocale } from "@/shared/i18n";
import { Button, Card } from "@/shared/ui";
import { AppShell } from "@/widgets/app-shell";

const styles: StyleTag[] = [
  "casual",
  "minimal",
  "classic",
  "smart_casual",
  "streetwear",
  "sporty",
  "formal",
];
export function SettingsPage() {
  const { t, i18n } = useTranslation();
  const api = useApiClient();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [style, setStyle] = useState<StyleProfile | null>(null);
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    if (revision < 0) {
      return undefined;
    }
    let active = true;
    setError("");
    void Promise.all([
      api.getProfile(),
      api.getStyleProfile(),
      api.getPreferences(),
      api.listCities(),
    ])
      .then(([p, s, pref, list]) => {
        if (active) {
          setProfile(p.profile);
          setStyle(s.styleProfile);
          setPreferences(pref.preferences);
          setCities(list);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : t("common.error"));
        }
      });
    return () => {
      active = false;
    };
  }, [api, t, revision]);
  function save() {
    if (!profile || !style || !preferences) {
      return;
    }
    startTransition(async () => {
      setError("");
      setMessage("");
      try {
        await api.updateProfile({
          cityId: profile.cityId,
          temperaturePreference: profile.temperaturePreference,
          preferredLanguage: preferences.locale,
        });
        await api.updateStyleProfile({
          preferredStyles: style.preferredStyles,
          preferredFits: style.preferredFits,
          comfortPriority: style.comfortPriority,
        });
        await api.updatePreferences(preferences);
        await changeLocale(preferences.locale);
        setMessage("settingsSaved");
      } catch (err) {
        setError(err instanceof Error ? err.message : t("common.error"));
      }
    });
  }
  const selectClass =
    "mt-2 min-h-12 w-full rounded-2xl border border-outline-variant bg-surface px-3 text-base";
  return (
    <AppShell title={t("experience.settings")}>
      <div className="space-y-5">
        <div className="py-3">
          <h1 className="font-display text-3xl">{t("experience.makeItYours")}</h1>
          <p className="mt-2 text-sm text-on-surface-variant">{t("experience.settingsHint")}</p>
        </div>
        <p role="alert" className="text-sm text-error empty:hidden">
          {error}
        </p>
        {error && !profile ? (
          <Button onClick={() => setRevision(revision + 1)}>{t("experience.retry")}</Button>
        ) : null}
        {!profile || !style || !preferences ? (
          <p role="status">{error ? null : t("experience.loading")}</p>
        ) : (
          <>
            <Card className="space-y-5">
              <label className="block text-sm font-semibold">
                {t("experience.city")}
                <select
                  className={selectClass}
                  value={profile.cityId ?? ""}
                  onChange={(e) => setProfile({ ...profile, cityId: e.target.value || null })}
                >
                  <option value="">{t("experience.noCity")}</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {i18n.language.startsWith("fa") ? city.nameFa : city.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-semibold">
                {t("experience.units")}
                <select
                  className={selectClass}
                  value={profile.temperaturePreference}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      temperaturePreference:
                        e.target.value === "fahrenheit" ? "fahrenheit" : "celsius",
                    })
                  }
                >
                  <option value="celsius">°C</option>
                  <option value="fahrenheit">°F</option>
                </select>
              </label>
              <label className="block text-sm font-semibold">
                {t("experience.language")}
                <select
                  className={selectClass}
                  value={preferences.locale}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      locale: preferencesSchema.shape.locale.parse(e.target.value),
                    })
                  }
                >
                  <option value="en-GB">English</option>
                  <option value="fa-IR">فارسی</option>
                </select>
              </label>
            </Card>
            <Card className="space-y-4">
              <h2 className="font-display text-xl">{t("experience.yourStyle")}</h2>
              <div className="flex flex-wrap gap-2">
                {styles.map((value) => (
                  <Button
                    key={value}
                    variant={style.preferredStyles.includes(value) ? "filled" : "outlined"}
                    size="sm"
                    aria-pressed={style.preferredStyles.includes(value)}
                    onClick={() =>
                      setStyle({
                        ...style,
                        preferredStyles: style.preferredStyles.includes(value)
                          ? style.preferredStyles.filter((s) => s !== value)
                          : [...style.preferredStyles, value],
                      })
                    }
                  >
                    {t(`onboarding.styles.${value}`, value.replaceAll("_", " "))}
                  </Button>
                ))}
              </div>
              <label className="block text-sm font-semibold">
                {t("experience.fit")}
                <select
                  className={selectClass}
                  value={style.preferredFits[0] ?? "regular"}
                  onChange={(e) =>
                    setStyle({
                      ...style,
                      preferredFits: [fitPreferenceSchema.parse(e.target.value)],
                    })
                  }
                >
                  {["regular", "oversized", "fitted"].map((fit) => (
                    <option key={fit} value={fit}>
                      {t(`experience.${fit}`)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex min-h-12 items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={style.comfortPriority ?? false}
                  onChange={(e) => setStyle({ ...style, comfortPriority: e.target.checked })}
                  className="size-5"
                />
                {t("experience.comfort")}
              </label>
            </Card>
            <Card className="space-y-4">
              <h2 className="font-display text-xl">{t("experience.previewProfile")}</h2>
              <p className="text-sm text-on-surface-variant">{t("experience.bodyHint")}</p>
              <label className="block text-sm font-semibold">
                {t("experience.height")}
                <select
                  className={selectClass}
                  value={preferences.heightBand}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      heightBand: preferencesSchema.shape.heightBand.parse(e.target.value),
                    })
                  }
                >
                  {["unspecified", "petite", "average", "tall"].map((height) => (
                    <option key={height} value={height}>
                      {t(`experience.${height}`)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-semibold">
                {t("experience.silhouette")}
                <select
                  className={selectClass}
                  value={preferences.silhouette}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      silhouette: preferencesSchema.shape.silhouette.parse(e.target.value),
                    })
                  }
                >
                  <option value="straight">{t("experience.straight")}</option>
                  <option value="relaxed">{t("experience.relaxed")}</option>
                </select>
              </label>
            </Card>
            <Button fullWidth size="lg" disabled={pending} onClick={save}>
              {pending ? t("experience.saving") : t("experience.saveSettings")}
            </Button>
          </>
        )}
        <p role="status" className="text-sm text-primary empty:hidden">
          {message ? t(`experience.${message}`) : null}
        </p>
        {!isClerkEnabled() ? (
          <Card className="space-y-3">
            <h2 className="font-display text-xl">{t("experience.demo")}</h2>
            <p className="text-sm text-on-surface-variant">{t("experience.demoHint")}</p>
            <Button
              variant="tonal"
              fullWidth
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  setError("");
                  try {
                    await api.seedDemo();
                    setMessage("demoReady");
                    setRevision(revision + 1);
                  } catch (err) {
                    setError(err instanceof Error ? err.message : t("common.error"));
                  }
                })
              }
            >
              {t("experience.demoButton")}
            </Button>
          </Card>
        ) : (
          <UserAuthControls />
        )}
      </div>
    </AppShell>
  );
}
