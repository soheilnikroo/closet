import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import type { Metric } from "web-vitals";

/** Opt-in local diagnostics. Nothing is sent to an analytics service. */
export function PerformanceDiagnostics() {
  const [params] = useSearchParams();
  const enabled = params.get("performance") === "1";
  const [metrics, setMetrics] = useState<Record<string, { value: number; rating: string }>>({});
  useEffect(() => {
    if (!enabled) {
      return undefined;
    }
    let active = true;
    function report(metric: Metric) {
      if (active) {
        setMetrics((current) => ({
          ...current,
          [metric.name]: { value: metric.value, rating: metric.rating },
        }));
      }
    }
    void import("web-vitals").then(({ onCLS, onLCP, onINP, onTTFB, onFCP }) => {
      if (!active) {
        return;
      }
      const options = { reportAllChanges: true };
      onCLS(report, options);
      onLCP(report, options);
      onINP(report, options);
      onTTFB(report);
      onFCP(report);
    });
    return () => {
      active = false;
    };
  }, [enabled]);
  if (!enabled) {
    return null;
  }
  return (
    <aside
      aria-label="Local performance diagnostics"
      className="fixed top-16 left-2 z-[100] max-w-60 rounded-xl border bg-white p-3 text-xs text-black shadow-lg"
    >
      <p>Local Web Vitals</p>
      <dl>
        {["LCP", "INP", "CLS", "FCP", "TTFB"].map((name) => (
          <div key={name} className="flex gap-2">
            <dt>{name}</dt>
            <dd>
              {metrics[name]
                ? `${metrics[name].value.toFixed(name === "CLS" ? 3 : 0)}${name === "CLS" ? "" : " ms"} · ${metrics[name].rating}`
                : "Awaiting browser measurement"}
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
