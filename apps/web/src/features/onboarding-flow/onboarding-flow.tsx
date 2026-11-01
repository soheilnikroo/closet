import { useOnboardingFlow } from "@/features/onboarding-flow/model/use-onboarding-flow.js";
import type { OnboardingFlowProps } from "@/features/onboarding-flow/onboarding-flow.types.js";
import { CityStep } from "@/features/onboarding-flow/ui/city-step.js";
import { ClothingStep } from "@/features/onboarding-flow/ui/clothing-step.js";
import { FirstOutfitStep } from "@/features/onboarding-flow/ui/first-outfit-step.js";
import { ReviewStep } from "@/features/onboarding-flow/ui/review-step.js";
import { StylesStep } from "@/features/onboarding-flow/ui/styles-step.js";
import { WelcomeStep } from "@/features/onboarding-flow/ui/welcome-step.js";
import { Match } from "@/shared/lib";
import { Card, Progress } from "@/shared/ui";

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const flow = useOnboardingFlow({ onComplete });

  return (
    <div className="space-y-4">
      <Progress value={flow.progress} />

      <Card className="border border-error/30 bg-error-container/20 text-sm text-error empty:hidden">
        {flow.error}
      </Card>

      <Match
        value={flow.step}
        cases={{
          welcome: <WelcomeStep busy={flow.busy} t={flow.t} onContinue={flow.goStyles} />,
          styles: (
            <StylesStep
              busy={flow.busy}
              t={flow.t}
              styles={flow.styles}
              onToggle={flow.toggleStyle}
              onContinue={() => flow.saveStyles(false)}
              onSkip={() => flow.saveStyles(true)}
            />
          ),
          city: (
            <CityStep
              busy={flow.busy}
              t={flow.t}
              language={flow.i18n.language}
              cities={flow.cities}
              cityId={flow.cityId}
              onSelect={flow.setCityId}
              onContinue={() => flow.saveCity(false)}
              onSkip={() => flow.saveCity(true)}
            />
          ),
          clothing: (
            <ClothingStep
              busy={flow.busy}
              t={flow.t}
              onUpload={flow.uploadPhotos}
              onSample={flow.loadSampleCatalog}
            />
          ),
          review: (
            <ReviewStep
              busy={flow.busy}
              t={flow.t}
              detections={flow.detections}
              onConfirm={flow.confirmDetections}
            />
          ),
          first_outfit: flow.recommendation ? (
            <FirstOutfitStep
              busy={flow.busy}
              t={flow.t}
              recommendation={flow.recommendation}
              onFeedback={flow.sendFeedback}
            />
          ) : null,
          feedback: null,
        }}
      />
    </div>
  );
}
