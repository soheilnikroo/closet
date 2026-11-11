/* oxlint-disable jsx-a11y/anchor-is-valid -- React Router Link renders an anchor from its to prop. */
import { collectionsResponseSchema, collectionDetailSchema } from "@closet/shared";
import type { CollectionInput, OutfitCollection, Recommendation } from "@closet/shared";
import { useEffect, useState, ViewTransition } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router";

import { CollectionForm } from "@/features/collection-picker/collection-form.js";
import { InteractiveOutfitCard } from "@/features/outfit-card/interactive-outfit-card.js";
import { useApiClient } from "@/shared/hooks";
import { BottomSheet, Button } from "@/shared/ui";
import { PageSkeleton } from "@/shared/ui/skeleton.js";
import { AppShell } from "@/widgets/app-shell";

import { CollectionCover } from "./collection-cover.js";

export function CollectionsPage() {
  const { collectionId } = useParams();
  const { t } = useTranslation();
  const api = useApiClient();
  const initialDetail = collectionId
    ? api.cached(`/v1/collections/${collectionId}`, (data) => collectionDetailSchema.parse(data))
    : undefined;
  const [collections, setCollections] = useState<OutfitCollection[] | null>(
    () =>
      api.cached("/v1/collections", (data) => collectionsResponseSchema.parse(data))?.collections ??
      null,
  );
  const [selected, setSelected] = useState<OutfitCollection | null>(
    initialDetail?.collection ?? null,
  );
  const [outfits, setOutfits] = useState<Recommendation[] | null>(initialDetail?.outfits ?? null);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    if (revision < 0) {
      return undefined;
    }
    let active = true;
    setError("");
    const saved = collectionId
      ? api.cached(`/v1/collections/${collectionId}`, (data) => collectionDetailSchema.parse(data))
      : undefined;
    setOutfits(saved?.outfits ?? null);
    setSelected(saved?.collection ?? null);
    const request = collectionId
      ? api.getCollection(collectionId).then((result) => {
          if (active) {
            setSelected(result.collection);
            setOutfits(result.outfits);
          }
        })
      : api.listCollections().then((result) => {
          if (active) {
            setCollections(result.collections);
          }
        });
    void request.catch(() => {
      if (active) {
        setError(t("common.error"));
      }
    });
    return () => {
      active = false;
    };
  }, [api, collectionId, revision, t]);
  async function reload() {
    setError("");
    try {
      if (collectionId) {
        const result = await api.fresh().getCollection(collectionId);
        setSelected(result.collection);
        setOutfits(result.outfits);
      } else {
        const result = await api.fresh().listCollections();
        setCollections(result.collections);
      }
    } catch (err) {
      setError(t("common.error"));
      throw err;
    }
  }
  async function save(input: CollectionInput) {
    if (busy) {
      return;
    }
    setBusy(true);
    setError("");
    try {
      if (collectionId) {
        await api.updateCollection(collectionId, input);
      } else {
        await api.createCollection(input);
      }
      setEditing(false);
      setRevision(revision + 1);
    } catch {
      setError(t("common.error"));
    } finally {
      setBusy(false);
    }
  }
  const current = selected?.id === collectionId ? selected : null;
  return (
    <AppShell onRefresh={busy || editing ? undefined : reload} title={t("collections.title")}>
      <div className="space-y-5">
        {collectionId ? (
          <Link
            to="/collections"
            className="md-state-layer md-label-large inline-flex min-h-12 items-center rounded-full px-4 text-primary"
          >
            {t("collections.back")}
          </Link>
        ) : (
          <div className="page-intro">
            <p className="eyebrow">{t("collections.eyebrow")}</p>
            <h2 className="mt-2">{t("collections.heading")}</h2>
            <p className="intro-description">{t("collections.intro")}</p>
          </div>
        )}
        {error ? (
          <div role="alert" className="rounded-xl bg-error-container p-4 text-on-error-container">
            {error}
            <Button variant="text" onClick={() => setRevision(revision + 1)}>
              {t("collections.retry")}
            </Button>
          </div>
        ) : null}
        {current ? (
          <ViewTransition name={`collection-${current.id}`}>
            <section className={`collection-${current.color} rounded-[28px] p-6`}>
              <p className="md-label-large">{t("collections.count", { count: current.count })}</p>
              <h2 className="md-headline-large mt-3 break-words">{current.name}</h2>
              {current.description ? (
                <p className="md-body-large mt-3">{current.description}</p>
              ) : null}
              <p className="md-body-medium mt-3">
                {[
                  current.occasion,
                  current.season !== "any" ? t(`collections.seasons.${current.season}`) : "",
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </section>
          </ViewTransition>
        ) : null}
        <Button
          variant="tonal"
          onClick={() => setEditing(true)}
          disabled={Boolean(collectionId && !current)}
        >
          {t(collectionId ? "collections.edit" : "collections.new")}
        </Button>
        {collectionId ? (
          <>
            {outfits === null && !error ? (
              <PageSkeleton
                variant={collectionId ? "outfit" : "grid"}
                label={t("experience.loading")}
              />
            ) : null}
            {outfits?.length === 0 ? (
              <div className="rounded-2xl bg-surface-container-low p-6">
                <p>{t("collections.empty")}</p>
                <Link className="mt-4 inline-flex min-h-12 items-center text-primary" to="/today">
                  {t("collections.findOutfit")}
                </Link>
              </div>
            ) : null}
            {outfits?.map((rec) => (
              <InteractiveOutfitCard key={rec.id} recommendation={rec} swipeable={false} />
            ))}
          </>
        ) : (
          <>
            {collections === null && !error ? (
              <PageSkeleton
                variant={collectionId ? "outfit" : "grid"}
                label={t("experience.loading")}
              />
            ) : null}
            {collections?.length === 0 ? (
              <p className="md-body-large rounded-2xl bg-surface-container-low p-6 text-on-surface-variant">
                {t("collections.first")}
              </p>
            ) : null}
            <div className="space-y-4">
              {collections?.map((collection) => (
                <ViewTransition key={collection.id} name={`collection-${collection.id}`}>
                  <Link
                    to={`/collections/${collection.id}`}
                    className="md-state-layer collection-row flex items-center gap-5 rounded-[24px] bg-surface-container-lowest p-3"
                  >
                    <CollectionCover collection={collection} />
                    <span>
                      <span className="block font-display text-lg font-semibold break-words">
                        {collection.name}
                      </span>
                      <span className="md-body-medium mt-1 block">
                        {t("collections.count", { count: collection.count })}
                      </span>
                    </span>
                  </Link>
                </ViewTransition>
              ))}
            </div>
          </>
        )}
      </div>
      {editing ? (
        <BottomSheet
          open
          title={t(collectionId ? "collections.edit" : "collections.new")}
          onClose={() => {
            if (!busy) {
              setEditing(false);
            }
          }}
        >
          <div className="space-y-4">
            <p role="alert" className="text-error empty:hidden">
              {error}
            </p>
            <CollectionForm
              initial={current ?? undefined}
              busy={busy}
              submitLabel={t(collectionId ? "closet.save" : "collections.new")}
              onSubmit={(input) => {
                void save(input);
              }}
            />
          </div>
        </BottomSheet>
      ) : null}
    </AppShell>
  );
}
