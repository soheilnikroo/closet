import { ClerkProvider } from "@clerk/clerk-react";
import { MotionConfig } from "motion/react";
import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";

import { getNullAuthToken } from "@/app/providers/app-providers.constants.js";
import type { AppProvidersProps } from "@/app/providers/app-providers.types.js";
import { ClerkTokenBridge } from "@/app/providers/clerk-token-bridge.js";
import { useMaterialRipple } from "@/app/providers/use-material-ripple.js";
import { AuthTokenContext } from "@/shared/hooks";
import {
  getOptionalClerkPublishableKey,
  initI18n,
  i18n,
  isClerkEnabled,
  POST_AUTH_REDIRECT,
} from "@/shared/index.js";

export function AppProviders({ children }: AppProvidersProps) {
  useMaterialRipple();
  const [ready, setReady] = useState(i18n.isInitialized);
  const publishableKey = getOptionalClerkPublishableKey();
  const clerkEnabled = isClerkEnabled();

  useEffect(() => {
    let cancelled = false;

    void initI18n().then(() => {
      if (!cancelled) {
        setReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return null;
  }

  const withI18n = (
    <I18nextProvider i18n={i18n}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </I18nextProvider>
  );

  if (!clerkEnabled || !publishableKey) {
    return (
      <AuthTokenContext.Provider value={getNullAuthToken}>{withI18n}</AuthTokenContext.Provider>
    );
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      afterSignOutUrl="/"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl={POST_AUTH_REDIRECT}
      signUpFallbackRedirectUrl={POST_AUTH_REDIRECT}
    >
      <ClerkTokenBridge>{withI18n}</ClerkTokenBridge>
    </ClerkProvider>
  );
}
