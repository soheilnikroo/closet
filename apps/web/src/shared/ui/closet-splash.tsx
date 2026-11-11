import { version } from "../../../package.json";
import { ClosetMark } from "./closet-brand.js";

/** Startup only: never adds a timer or delays a cached route. */
export function ClosetSplash() {
  return (
    <div className="closet-splash" role="status" aria-label="Opening Closet">
      <div className="closet-splash-identity">
        <ClosetMark animated />
        <h1>Closet</h1>
        <p>Your clothes. Your rhythm.</p>
      </div>
      <p className="closet-version" aria-label={`Version ${version}`}>
        v{version}
      </p>
    </div>
  );
}
