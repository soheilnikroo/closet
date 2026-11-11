import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import type { TodayWeatherCardProps } from "@/pages/today-page/ui/today-weather-card.types.js";
import { useApiClient } from "@/shared/hooks";
import { softSpring } from "@/shared/lib";
import { Card } from "@/shared/ui";

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
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={softSpring}
    >
      <Card className="flex items-center justify-between gap-3 bg-tertiary-container text-on-tertiary-container">
        <div>
          <p className="md-label-medium tracking-[0.08em] text-on-tertiary-container/80 uppercase">
            {t("today.weather")}
          </p>
          <p className="mt-1 font-display text-2xl leading-8 font-medium">
            {temperature(weather.feelsLike)} · {weather.condition.replaceAll("_", " ")}
          </p>
          <p className="md-body-medium opacity-80">{weather.cityName}</p>
        </div>
        <div className="md-body-medium text-end opacity-85">
          <div>
            {temperature(weather.minTemperature)} / {temperature(weather.maxTemperature)}
          </div>
          <div className="mt-1">
            {t("today.rain")}: {weather.precipitationProbability}%
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
