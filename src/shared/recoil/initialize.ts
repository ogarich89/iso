import type { MutableSnapshot, RecoilState } from 'recoil';

export const initializeState =
  (state: Array<[RecoilState<any>, any]>) =>
  ({ set }: MutableSnapshot) => {
    state.forEach(([atom, data]) => {
      set(atom, data);
    });
  };
