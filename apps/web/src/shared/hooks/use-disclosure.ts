import { useCallback, useState } from "react";

export type Disclosure = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  setOpen: (open: boolean) => void;
};

export function useDisclosure(initialOpen = false): Disclosure {
  const [open, setOpen] = useState(initialOpen);

  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => setOpen(false), []);
  const onToggle = useCallback(() => setOpen((current) => !current), []);

  return { open, onOpen, onClose, onToggle, setOpen };
}
