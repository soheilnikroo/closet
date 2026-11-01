export function useRegisterSW(_options?: { immediate?: boolean }) {
  return {
    needRefresh: [false, () => undefined] as [boolean, (value: boolean) => void],
    offlineReady: [false, () => undefined] as [boolean, (value: boolean) => void],
    updateServiceWorker: async (_reloadPage?: boolean) => undefined,
  };
}
