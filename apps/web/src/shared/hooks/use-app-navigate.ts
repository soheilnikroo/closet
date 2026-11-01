import { useNavigate, type NavigateOptions, type To } from "react-router";

/**
 * navigate() with View Transitions enabled so route changes feel native.
 * Falls back to a normal navigation where the API is unsupported.
 */
export function useAppNavigate() {
  const navigate = useNavigate();

  return (to: To | number, options?: NavigateOptions) => {
    if (typeof to === "number") {
      void navigate(to);
      return;
    }
    void navigate(to, { viewTransition: true, ...options });
  };
}
