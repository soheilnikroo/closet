type SignUpVerification = {
  strategy?: string | null;
  status?: string | null;
} | null;

type SignUpLike = {
  status?: string | null;
  missingFields?: string[] | null;
  verifications?: {
    emailAddress?: SignUpVerification;
    externalAccount?: SignUpVerification;
  } | null;
} | null;

function isOAuthStrategy(strategy: string | null | undefined): boolean {
  return typeof strategy === "string" && strategy.includes("oauth");
}

/**
 * True when Google (or other OAuth) verified the user, Clerk still says
 * `missing_requirements`, but there are no fields to collect — usually because
 * Password is Required in the Dashboard. Do NOT treat plain email/password
 * attempts as this state.
 */
export function isStuckOAuthSignUp(signUp: SignUpLike): boolean {
  if (!signUp || signUp.status !== "missing_requirements") {
    return false;
  }
  if ((signUp.missingFields?.length ?? 0) > 0) {
    return false;
  }

  const emailStrategy = signUp.verifications?.emailAddress?.strategy;
  const externalStrategy = signUp.verifications?.externalAccount?.strategy;
  const externalStatus = signUp.verifications?.externalAccount?.status;

  return (
    isOAuthStrategy(emailStrategy) ||
    isOAuthStrategy(externalStrategy) ||
    externalStatus === "verified"
  );
}

/** @deprecated Use `isStuckOAuthSignUp` — kept for older imports. */
export function isEmptySignUpContinue(signUp: SignUpLike): boolean {
  return isStuckOAuthSignUp(signUp);
}
