import { createContext, useContext, useSyncExternalStore } from "react";

export const OfflineAccountContext = createContext<string | null>(null);
export const OfflineOnlyContext = createContext(false);
export function useOfflineAccount() {
  return useContext(OfflineAccountContext);
}
export function useOfflineOnly() {
  return useContext(OfflineOnlyContext);
}
function subscribe(listener: () => void) {
  window.addEventListener("online", listener);
  window.addEventListener("offline", listener);
  return () => {
    window.removeEventListener("online", listener);
    window.removeEventListener("offline", listener);
  };
}
function getSnapshot() {
  return !navigator.onLine;
}
function getServerSnapshot() {
  return false;
}
export function useOffline() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
const accountKey = "closet.offline-account.v1";
export function readOfflineAccount(): string | null {
  try {
    return localStorage.getItem(accountKey);
  } catch {
    return null;
  }
}
export function rememberOfflineAccount(account: string | null) {
  try {
    if (account) {
      localStorage.setItem(accountKey, account);
    } else {
      localStorage.removeItem(accountKey);
    }
  } catch {
    /* Private browsing. */
  }
}
