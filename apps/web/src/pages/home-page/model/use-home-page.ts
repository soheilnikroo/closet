import { useTranslation } from "react-i18next";

import { isClerkEnabled } from "@/shared/config";
import { useAppNavigate } from "@/shared/hooks";

export function useHomePage() {
  const { t } = useTranslation();
  const navigate = useAppNavigate();
  const clerkEnabled = isClerkEnabled();

  return {
    t,
    navigate,
    clerkEnabled,
  };
}
