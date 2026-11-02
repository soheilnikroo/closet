type SignUpLike = {
  status?: string | null;
  missingFields?: string[] | null;
  unverifiedFields?: string[] | null;
  emailAddress?: string | null;
  passwordEnabled?: boolean | null;
  hasPassword?: boolean | null;
  verifications?: {
    emailAddress?: { status?: string | null } | null;
  } | null;
} | null;

/**
 * Email verified + password set, but Clerk still reports `missing_requirements`
 * with nothing left to collect — often legal acceptance or a half-created user.
 */
export function isSatisfiedIncompleteSignUp(signUp: SignUpLike): boolean {
  if (!signUp || signUp.status !== "missing_requirements") {
    return false;
  }
  if ((signUp.missingFields?.length ?? 0) > 0) {
    return false;
  }
  if ((signUp.unverifiedFields?.length ?? 0) > 0) {
    return false;
  }

  const emailVerified =
    signUp.verifications?.emailAddress?.status === "verified" || Boolean(signUp.emailAddress);
  const passwordReady = Boolean(signUp.passwordEnabled ?? signUp.hasPassword);

  return emailVerified && passwordReady;
}
