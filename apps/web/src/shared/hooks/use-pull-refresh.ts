import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

const threshold = 72;
export function usePullRefresh(
  target: RefObject<HTMLElement | null>,
  refresh?: () => Promise<void>,
) {
  const callback = useRef(refresh);
  const locked = useRef(false);
  const mounted = useRef(true);
  const [distance, setDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [result, setResult] = useState<"idle" | "success" | "error">("idle");
  useEffect(() => {
    callback.current = refresh;
  }, [refresh]);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const run = useCallback(async () => {
    if (locked.current || !callback.current) {
      return;
    }
    locked.current = true;
    setDistance(0);
    setRefreshing(true);
    setResult("idle");
    try {
      await callback.current();
      if (mounted.current) {
        setResult("success");
      }
    } catch {
      if (mounted.current) {
        setResult("error");
      }
    } finally {
      locked.current = false;
      if (mounted.current) {
        setRefreshing(false);
      }
    }
  }, []);
  const enabled = Boolean(refresh);
  useEffect(() => {
    const node = target.current;
    if (!node || !enabled) {
      return undefined;
    }
    let origin: { x: number; y: number } | null = null;
    let pulled = 0;
    function reset() {
      origin = null;
      pulled = 0;
      setDistance(0);
    }
    function start(event: TouchEvent) {
      const touch = event.touches[0];
      if (
        !touch ||
        event.touches.length !== 1 ||
        node?.scrollTop !== 0 ||
        locked.current ||
        (event.target instanceof Element &&
          event.target.closest('button,a,input,textarea,select,summary,[role="dialog"]'))
      ) {
        reset();
        return;
      }
      origin = { x: touch.clientX, y: touch.clientY };
      pulled = 0;
      setResult("idle");
    }
    function move(event: TouchEvent) {
      const touch = event.touches[0];
      if (event.touches.length !== 1) {
        reset();
        return;
      }
      if (!origin || !touch) {
        return;
      }
      const dx = Math.abs(touch.clientX - origin.x);
      const dy = touch.clientY - origin.y;
      if (dx > Math.max(12, Math.abs(dy)) || dy < 0 || (node?.scrollTop ?? 0) > 0) {
        reset();
        return;
      }
      if (dy > 8 && event.cancelable) {
        event.preventDefault();
        pulled = Math.min(100, dy * 0.45);
        setDistance(pulled);
      }
    }
    function end() {
      const ready = pulled >= threshold;
      reset();
      if (ready) {
        void run();
      }
    }
    node.addEventListener("touchstart", start, { passive: true });
    node.addEventListener("touchmove", move, { passive: false });
    node.addEventListener("touchend", end);
    node.addEventListener("touchcancel", reset);
    return () => {
      node.removeEventListener("touchstart", start);
      node.removeEventListener("touchmove", move);
      node.removeEventListener("touchend", end);
      node.removeEventListener("touchcancel", reset);
    };
  }, [enabled, run, target]);
  return { distance, refreshing, result, ready: distance >= threshold, run };
}
