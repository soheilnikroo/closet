import { useEffect, useState, useRef, useCallback } from "react";

import { getApiBaseUrl } from "@/shared/config";
import { garmentBlob } from "@/shared/lib/offline/media-cache.js";
import { useOfflineAccount, useOfflineOnly } from "@/shared/lib/offline/offline-context.js";
import { snapshotScope } from "@/shared/lib/offline/snapshot-cache.js";

import { useAuthToken } from "./auth-token-context.js";

export function useGarmentImage(imageUrl?: string | null) {
  const element = useRef<Element | null>(null);
  const observe = useCallback((node: Element | null) => {
    element.current = node;
  }, []);
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === "undefined");
  useEffect(() => {
    if (!element.current || typeof IntersectionObserver === "undefined") {
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(element.current);
    return () => observer.disconnect();
  }, []);
  const account = useOfflineAccount();
  const offlineOnly = useOfflineOnly();
  const getToken = useAuthToken();
  const [loaded, setLoaded] = useState<{ key: string; url: string } | null>(null);
  const privatePhoto = imageUrl?.startsWith("/v1/wardrobe/media/");
  const identity = `${account}:${imageUrl}`;
  useEffect(() => {
    if (!visible || !privatePhoto || !imageUrl || !account) {
      return undefined;
    }
    let active = true;
    let objectUrl: string | undefined;
    const base = getApiBaseUrl();
    const url = new URL(`${base}${imageUrl}`, window.location.origin).href;
    void garmentBlob(snapshotScope(base, account), url, getToken, offlineOnly)
      .then((blob) => {
        if (!active) {
          return;
        }
        objectUrl = URL.createObjectURL(blob);
        setLoaded({ key: identity, url: objectUrl });
      })
      .catch(() => {
        /* Keep the garment illustration when a photo is unavailable. */
      });
    return () => {
      active = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [account, getToken, identity, imageUrl, offlineOnly, privatePhoto, visible]);
  return {
    source: privatePhoto ? (loaded?.key === identity ? loaded.url : null) : imageUrl,
    observe,
  };
}
