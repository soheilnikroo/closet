import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  index("routes/home/route.tsx"),
  route("sign-in/*", "routes/sign-in/route.tsx"),
  route("sign-up/*", "routes/sign-up/route.tsx"),
  route("sso-callback", "routes/sso-callback/route.tsx"),
  route("onboarding", "routes/onboarding/route.tsx"),
  layout("routes/app-shell/route.tsx", [
    route("today", "routes/today/route.tsx"),
    route("closet", "routes/closet/route.tsx"),
    route("discover", "routes/discover/route.tsx"),
  ]),
] satisfies RouteConfig;
