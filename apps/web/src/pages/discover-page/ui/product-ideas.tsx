import type { Product } from "@closet/shared";
import { useEffect, useState, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { useApiClient } from "@/shared/hooks";
import { Button, Card } from "@/shared/ui";

export function ProductIdeas({ products }: { products: Product[] }) {
  const { t, i18n } = useTranslation();
  const api = useApiClient();
  const navigate = useNavigate();
  const [saved, setSaved] = useState<string[]>([]);
  const [onlySaved, setOnlySaved] = useState(false);
  const [ready, setReady] = useState(false);
  const [busy, startTransition] = useTransition();
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    void api
      .getPreferences()
      .then(({ preferences }) => {
        if (active) {
          setSaved(preferences.savedDiscoverIds);
          setReady(true);
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
  }, [api, t]);
  function toggle(id: string) {
    startTransition(async () => {
      setError("");
      try {
        const ids = saved.includes(id) ? saved.filter((value) => value !== id) : [...saved, id];
        const result = await api.updatePreferences({ savedDiscoverIds: ids });
        setSaved(result.preferences.savedDiscoverIds);
      } catch (err) {
        setError(err instanceof Error ? err.message : t("common.error"));
      }
    });
  }
  if (!products.length) {
    return null;
  }
  const visible = onlySaved ? products.filter((product) => saved.includes(product.id)) : products;
  return (
    <section className="space-y-4">
      <div>
        <h2 className="sr-only">{t("experience.ideas")}</h2>
        <p className="sr-only">{t("experience.ideasHint")}</p>
      </div>
      <Button variant="tonal" aria-pressed={onlySaved} onClick={() => setOnlySaved(!onlySaved)}>
        {onlySaved ? t("experience.allIdeas") : t("experience.savedIdeas")}
      </Button>
      <p role="alert" className="text-sm text-error empty:hidden">
        {error}
      </p>
      {onlySaved && !visible.length ? <p className="text-sm">{t("experience.noSaved")}</p> : null}
      <div className="grid grid-cols-2 gap-3">
        {visible.map((product) => (
          <Card key={product.id} className="discovery-piece space-y-3 !p-0">
            <img
              src={product.imageUrl}
              alt=""
              loading="lazy"
              className="aspect-square w-full rounded-[22px] bg-surface-container-low object-contain p-3"
            />
            <h3 className="px-1 text-sm font-semibold">
              {i18n.language.startsWith("fa") ? product.nameFa : product.name}
            </h3>
            <Button
              fullWidth
              size="sm"
              variant="tonal"
              disabled={busy || !ready}
              aria-pressed={saved.includes(product.id)}
              onClick={() => toggle(product.id)}
            >
              {saved.includes(product.id) ? t("experience.saved") : t("experience.saveIdea")}
            </Button>
            <details className="product-details">
              <summary>{t("refine.more")}</summary>
              <Button
                fullWidth
                size="sm"
                variant="text"
                onClick={() => {
                  void navigate(`/closet?add=${product.categorySlug}`);
                }}
              >
                {t("experience.ownThis")}
              </Button>
            </details>
          </Card>
        ))}
      </div>
    </section>
  );
}
