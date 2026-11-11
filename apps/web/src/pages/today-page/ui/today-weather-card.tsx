import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useApiClient } from "@/shared/hooks";

import type { TodayWeatherCardProps } from "./today-weather-card.types.js";
export function TodayWeatherCard({ weather }: TodayWeatherCardProps) {
  const { t, i18n } = useTranslation();
  const api = useApiClient();
  const [unit, setUnit] = useState<"celsius" | "fahrenheit">("celsius");
  useEffect(() => {
    let active = true;
    void api
      .getProfile()
      .then(({ profile }) => {
        if (active) {
          setUnit(profile.temperaturePreference);
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [api]);
  const temperature = (value: number) =>
    `${Math.round(unit === "fahrenheit" ? (value * 9) / 5 + 32 : value).toLocaleString(i18n.language)}°${unit === "fahrenheit" ? "F" : "C"}`;
  return (
    <details className="weather-summary">
      <summary>
        <span>{weather.cityName}</span>
        <span className="weather-temperature">{temperature(weather.feelsLike)}</span>
        <span className="truncate">{weather.condition.replaceAll("_", " ")}</span>
      </summary>
      <div className="flex flex-wrap gap-4 px-4 pb-4 text-sm text-on-surface-variant">
        <span>
          {temperature(weather.minTemperature)} / {temperature(weather.maxTemperature)}
        </span>
        <span>
          {t("today.rain")}: {weather.precipitationProbability}%
        </span>
      </div>
    </details>
  );
}
