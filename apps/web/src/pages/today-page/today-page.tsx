import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

import { fadeUp } from "@/shared/lib";
import { Card } from "@/shared/ui";
import { AppShell } from "@/widgets/app-shell";

export function TodayPage() {
  const { t } = useTranslation();

  return (
    <AppShell title={t("today.title")}>
      <motion.div {...fadeUp}>
        <Card elevated>
          <p className="text-sm leading-relaxed text-on-surface-variant">
            {t("today.placeholder")}
          </p>
        </Card>
      </motion.div>
    </AppShell>
  );
}
