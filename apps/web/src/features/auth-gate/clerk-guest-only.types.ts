import type { ReactNode } from "react";

export type ClerkGuestOnlyProps = {
  children: ReactNode;
  /** Safe app path to send already-signed-in users to. */
  redirectTo: string;
};
