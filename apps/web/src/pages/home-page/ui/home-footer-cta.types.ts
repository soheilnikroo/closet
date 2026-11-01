export type HomeFooterCtaProps = {
  clerkEnabled: boolean;
  ctaStart: string;
  ctaSignIn: string;
  ctaOpenApp: string;
  explore: string;
  onStart: () => void;
  onSignIn: () => void;
  onOpenApp: () => void;
  onExplore: () => void;
  onExploreSignedOut: () => void;
};
