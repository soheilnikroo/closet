import { AuthGate } from "@/features/auth-gate";
import { OnboardingPage } from "@/pages/onboarding-page";

export default function OnboardingRoute() {
  return (
    <AuthGate>
      <OnboardingPage />
    </AuthGate>
  );
}
