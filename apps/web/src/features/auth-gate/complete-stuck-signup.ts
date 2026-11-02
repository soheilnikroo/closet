import type { useClerk, useSignUp } from "@clerk/clerk-react";

type ClerkClient = ReturnType<typeof useClerk>;
type SignUpResource = NonNullable<ReturnType<typeof useSignUp>["signUp"]>;

type CompleteStuckSignUpResult =
  | { ok: true; sessionId: string }
  | { ok: false; reason: "still_incomplete" | "error" };

/**
 * Last-mile completion when Clerk's Continue UI loops with empty `missingFields`.
 * Tries legal acceptance (common silent blocker), then activates the session.
 */
export async function completeStuckSignUp(
  clerk: ClerkClient,
  signUp: SignUpResource,
): Promise<CompleteStuckSignUpResult> {
  try {
    const updated = await signUp.update({ legalAccepted: true });

    if (updated.status === "complete" && updated.createdSessionId) {
      await clerk.setActive({ session: updated.createdSessionId });
      return { ok: true, sessionId: updated.createdSessionId };
    }

    // Newer Clerk builds expose finalize(); older ones only use setActive.
    const maybeFinalize = updated as SignUpResource & {
      finalize?: (opts: {
        navigate: (args: { session?: { id?: string } | null }) => Promise<void> | void;
      }) => Promise<unknown>;
    };

    if (typeof maybeFinalize.finalize === "function") {
      let sessionId: string | null = updated.createdSessionId;
      await maybeFinalize.finalize({
        navigate: ({ session }) => {
          sessionId = session?.id ?? sessionId;
        },
      });
      if (sessionId) {
        await clerk.setActive({ session: sessionId });
        return { ok: true, sessionId };
      }
    }

    return { ok: false, reason: "still_incomplete" };
  } catch {
    return { ok: false, reason: "error" };
  }
}
