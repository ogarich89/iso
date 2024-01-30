import {
  useDispatch as useReduxDispatch,
  useSelector as useReduxSelector,
} from 'react-redux';

import type { TypedUseSelectorHook } from 'react-redux';
import type { Dispatch, State } from 'src/store';

export const useDispatch = () => useReduxDispatch<Dispatch>();

export const useSelector: TypedUseSelectorHook<State> = useReduxSelector;
