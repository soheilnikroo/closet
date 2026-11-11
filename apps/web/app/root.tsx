import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import { AppProviders } from "@/app/providers";
import { PwaReloadPrompt } from "@/features/pwa-reload-prompt";

import appStyles from "@/app/styles/app.css?url";

export const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&family=Vazirmatn:wght@400;500;600;700&display=swap",
  },
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
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fef7ff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#fef7ff" />
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
  return (
    <div className="flex min-h-dvh items-center justify-center bg-surface text-on-surface">
      <div className="flex flex-col items-center gap-3">
        <div
          className="size-11 animate-pulse rounded-full bg-primary/25 shadow-elevation-1"
          aria-hidden
        />
        <p className="font-display text-sm font-medium text-on-surface-variant">Loading…</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProviders>
      <Outlet />
      <PwaReloadPrompt />
    </AppProviders>
  );
}
