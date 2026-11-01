import { Outlet } from "react-router";

import { AuthGate } from "@/features/auth-gate";

export default function AppShellRoute() {
  return (
    <AuthGate>
      <Outlet />
    </AuthGate>
  );
}
