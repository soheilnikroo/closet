import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

import { fadeUp } from "@/shared/lib";
import { Card } from "@/shared/ui";
import { AppShell } from "@/widgets/app-shell";

export function ClosetPage() {
  const { t } = useTranslation();

  return (
    <AppShell title={t("closet.title")}>
      <motion.div {...fadeUp}>
        <Card elevated>
          <p className="text-sm leading-relaxed text-on-surface-variant">
            {t("closet.placeholder")}
          </p>
        </Card>
      </motion.div>
    </AppShell>
  );
}
