import { useHomePage } from "@/pages/home-page/model/use-home-page.js";
import { HomeFooterCta } from "@/pages/home-page/ui/home-footer-cta.js";
import { HomeHeader } from "@/pages/home-page/ui/home-header.js";
import { HomeHero } from "@/pages/home-page/ui/home-hero.js";
import { buildSignInHref } from "@/shared/config";
import { SkipLink } from "@/shared/ui";

/**
 * Landing composition: brand + story up top, one clear primary action in the
 * thumb zone. Header stays light — no duplicated Get started / Sign in.
 */
export function HomePage() {
  const page = useHomePage();

  return (
    <div className="mx-auto flex h-dvh w-full max-w-lg flex-col overflow-hidden bg-surface">
      <SkipLink label={page.t("a11y.skipToContent")} />

      <HomeHeader brand={page.t("brand")} clerkEnabled={page.clerkEnabled} />

      <HomeHero
        tagline={page.t("tagline")}
        title={page.t("home.title")}
        subtitle={page.t("home.subtitle")}
        brand={page.t("brand")}
      />

      <HomeFooterCta
        clerkEnabled={page.clerkEnabled}
        ctaStart={page.t("home.ctaStart")}
        ctaSignIn={page.t("home.ctaSignIn")}
        ctaOpenApp={page.t("home.ctaOpenApp")}
        explore={page.t("home.explore")}
        onStart={() => page.navigate("/onboarding")}
        onSignIn={() =>
          page.navigate(page.clerkEnabled ? buildSignInHref("/onboarding") : "/sign-in")
        }
        onOpenApp={() => page.navigate("/today")}
        onExplore={() => page.navigate("/today")}
        onExploreSignedOut={() => page.navigate(buildSignInHref("/today"))}
      />
    </div>
  );
}
