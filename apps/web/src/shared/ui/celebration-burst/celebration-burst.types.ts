export type CelebrationKind = "like" | "save" | "success";

export type CelebrationBurstProps = {
  open: boolean;
  kind?: CelebrationKind;
  onDone?: () => void;
  label?: string;
};
