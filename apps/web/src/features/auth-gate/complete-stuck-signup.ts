import type { useClerk, useSignUp } from "@clerk/clerk-react";

type ClerkClient = ReturnType<typeof useClerk>;
type SignUpResource = NonNullable<ReturnType<typeof useSignUp>["signUp"]>;

type CompleteStuckSignUpResult =
  | { ok: true; sessionId: string }
  | { ok: false; reason: "still_incomplete" | "error" | "timeout" };

const COMPLETE_TIMEOUT_MS = 4_000;

function withTimeout<T>(work: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error("timeout")), ms);
    work.then(
      (value) => {
        window.clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        window.clearTimeout(timer);
        reject(error instanceof Error ? error : new Error("signup-complete-failed"));
      },
    );
  });
}

/**
 * Last-mile completion when Clerk's Continue UI loops with empty `missingFields`.
 * Always settles — a hanging Clerk call cannot leave the page on a spinner.
 */
export async function completeStuckSignUp(
  clerk: ClerkClient,
  signUp: SignUpResource,
): Promise<CompleteStuckSignUpResult> {
  try {
    const updated = await withTimeout(signUp.update({ legalAccepted: true }), COMPLETE_TIMEOUT_MS);

    if (updated.status === "complete" && updated.createdSessionId) {
      await clerk.setActive({ session: updated.createdSessionId });
      return { ok: true, sessionId: updated.createdSessionId };
    }

    return { ok: false, reason: "still_incomplete" };
  } catch (error) {
    if (error instanceof Error && error.message === "timeout") {
      return { ok: false, reason: "timeout" };
    }
    return { ok: false, reason: "error" };
  }
}
