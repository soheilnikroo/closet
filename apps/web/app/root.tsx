import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import { AppProviders } from "@/app/providers";
import { PerformanceDiagnostics } from "@/features/performance-diagnostics/performance-diagnostics.js";
import { PwaReloadPrompt } from "@/features/pwa-reload-prompt";
import { OfflineBoundary, OfflineStatus } from "@/features/pwa-reload-prompt/offline-status.js";
import { ClosetSplash } from "@/shared/ui/closet-splash.js";

import appStyles from "@/app/styles/app.css?url";

export const meta = () => [
  { title: "Closet — your personal wardrobe" },
  {
    name: "description",
    content: "Your clothes, favourite outfits and personal style, together in one simple closet.",
  },
];

export const links = () => [
  { rel: "stylesheet", href: appStyles },
  { rel: "icon", href: "/favicon.ico", sizes: "48x48" },
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
  { rel: "apple-touch-icon", href: "/apple-touch-icon-180x180.png" },
  { rel: "manifest", href: "/manifest.webmanifest" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content"
        />
        <meta name="color-scheme" content="light" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fafbf7" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#fafbf7" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Closet" />
        <Meta />
        <Links />
      </head>
      <body className="bg-surface text-on-surface antialiased">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function HydrateFallback() {
  return <ClosetSplash />;
}

export default function App() {
  return (
    <AppProviders>
      <OfflineBoundary>
        <Outlet />
      </OfflineBoundary>
      <OfflineStatus />
      <PwaReloadPrompt />
      <PerformanceDiagnostics />
    </AppProviders>
  );
}
