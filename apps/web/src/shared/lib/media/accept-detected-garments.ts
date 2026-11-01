import type { ConfirmMediaRequest, DetectedGarment } from "@closet/shared";

/** Maps AI detections into confirm-media garments marked accepted. */
export function acceptDetectedGarments(
  detections: DetectedGarment[],
): ConfirmMediaRequest["garments"] {
  return detections.map((garment) => ({ ...garment, accepted: true }));
}
