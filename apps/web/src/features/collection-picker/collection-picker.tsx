import type { CollectionInput, OutfitCollection, Recommendation } from "@closet/shared";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { CollectionForm } from "@/features/collection-picker/collection-form.js";
import { useApiClient } from "@/shared/hooks";
import { BottomSheet, Button, TextField } from "@/shared/ui";
import { PageSkeleton } from "@/shared/ui/skeleton.js";

export function CollectionPicker({
  recommendation,
  action,
  onClose,
  onSaved,
}: {
  recommendation: Recommendation;
  action: "like" | "save";
  onClose: () => void;
  onSaved: (name: string, id: string) => void;
}) {
  const api = useApiClient();
  const { t } = useTranslation();
  const [collections, setCollections] = useState<OutfitCollection[] | null>(null);
  const [creating, setCreating] = useState(false);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    if (revision < 0) {
      return undefined;
    }
    let active = true;
    setError("");
    void api
      .listCollections()
      .then((result) => {
        if (active) {
          setCollections(result.collections);
        }
      })
      .catch(() => {
        if (active) {
          setError(t("common.error"));
        }
      });
    return () => {
      active = false;
    };
  }, [api, t, revision]);
  async function save(collection?: OutfitCollection, input?: CollectionInput) {
    if (busy) {
      return;
    }
    setBusy(true);
    setError("");
    try {
      if (collection) {
        await api.saveCollectionOutfit(collection.id, {
          recommendationId: recommendation.id,
          action,
        });
        onSaved(collection.name, collection.id);
      } else if (input) {
        const result = await api.createCollection({
          ...input,
          recommendationId: recommendation.id,
          action,
        });
        onSaved(result.collection.name, result.collection.id);
      }
    } catch {
      setError(t("common.error"));
    } finally {
      setBusy(false);
    }
  }
  return (
    <BottomSheet
      open
      title={t(creating ? "collections.new" : "collections.choose")}
      onClose={() => {
        if (!busy) {
          onClose();
        }
      }}
    >
      <div className="space-y-4">
        <p className="md-body-medium text-on-surface-variant">{recommendation.outfit.name}</p>
        {error ? (
          <div role="alert" className="rounded-md bg-error-container p-3 text-on-error-container">
            {error}
            {!collections ? (
              <Button variant="text" onClick={() => setRevision(revision + 1)}>
                {t("collections.retry")}
              </Button>
            ) : null}
          </div>
        ) : null}
        {creating ? (
          <>
            <Button variant="text" disabled={busy} onClick={() => setCreating(false)}>
              {t("closet.back")}
            </Button>
            <CollectionForm
              busy={busy}
              submitLabel={t("collections.createSave")}
              onSubmit={(input) => {
                void save(undefined, input);
              }}
            />
          </>
        ) : (
          <>
            <Button fullWidth variant="tonal" disabled={busy} onClick={() => setCreating(true)}>
              + {t("collections.new")}
            </Button>
            {collections === null && !error ? (
              <PageSkeleton variant="list" label={t("experience.loading")} />
            ) : null}
            {collections?.length === 0 ? (
              <p className="md-body-medium py-4 text-on-surface-variant">
                {t("collections.first")}
              </p>
            ) : null}
            {(collections?.length ?? 0) > 5 ? (
              <TextField
                label={t("collections.search")}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            ) : null}
            <div className="space-y-2">
              {collections
                ?.filter((collection) =>
                  collection.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
                )
                .map((collection) => (
                  <button
                    key={collection.id}
                    type="button"
                    disabled={busy}
                    className="md-state-layer flex min-h-20 w-full items-center gap-4 rounded-xl border border-outline-variant/60 bg-surface p-4 text-start disabled:opacity-50"
                    onClick={() => {
                      void save(collection);
                    }}
                  >
                    <span
                      aria-hidden
                      className={`collection-${collection.color} flex size-12 shrink-0 items-center justify-center rounded-lg text-xl`}
                    >
                      {collection.name.slice(0, 1)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="md-title-medium block truncate">{collection.name}</span>
                      <span className="md-body-medium text-on-surface-variant">
                        {t("collections.count", { count: collection.count })}
                      </span>
                    </span>
                    <span aria-hidden>＋</span>
                  </button>
                ))}
            </div>
            {busy ? <p role="status">{t("experience.loading")}</p> : null}
          </>
        )}
      </div>
    </BottomSheet>
  );
}
