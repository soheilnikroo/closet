export {
  getWebEnv,
  getOptionalClerkPublishableKey,
  getApiBaseUrl,
  type WebEnv,
} from "@/shared/config/env.js";
export {
  isClerkEnabled,
  POST_AUTH_REDIRECT,
  SSO_CALLBACK_PATH,
  isAuthRoutePath,
  resolvePostAuthRedirect,
  buildSignInHref,
  buildSignUpHref,
} from "@/shared/config/clerk.js";
