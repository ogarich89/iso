import type { ModalName } from 'src/components/organisms/Modal/Modal';
import { create } from 'zustand';

interface ModalPayload {
  name?: ModalName;
  data?: Record<string, unknown>;
  isNotClose?: boolean;
}

interface ModalStore {
  name?: ModalName;
  data?: Record<string, unknown>;
  isNotClose: boolean;
  isShow: boolean;
  open: (payload: ModalPayload) => void;
  close: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  isNotClose: false,
  isShow: false,
  open: ({ name, data, isNotClose = false }) => set({ name, data, isNotClose, isShow: true }),
  close: () => set({ isShow: false }),
}));
