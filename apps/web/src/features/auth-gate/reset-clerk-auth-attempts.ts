import type { useClerk } from "@clerk/clerk-react";

type ClerkClient = ReturnType<typeof useClerk>;

/** Drop a stuck OAuth sign-up / sign-in so email+password can start clean. */
export async function resetClerkAuthAttempts(clerk: ClerkClient): Promise<void> {
  try {
    await clerk.client.signUp.create({});
  } catch {
    // Ignore — may already be empty or mid-flight.
  }
  try {
    await clerk.client.signIn.create({});
  } catch {
    // Ignore — may already be empty or mid-flight.
  }
}
