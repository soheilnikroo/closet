export type ClosetAddSheetProps = {
  open: boolean;
  title: string;
  uploadHint: string;
  sampleLabel: string;
  busy: boolean;
  onClose: () => void;
  onUpload: (files: FileList | null) => void;
  onSample: () => void;
};
