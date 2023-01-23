import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useRecoilState, useResetRecoilState } from 'recoil';

import type { RecoilState } from 'recoil';
import type { InitialAction } from 'src/types';

export const useInitialState = <Data>(
  initialAction: InitialAction<Data>,
  state: RecoilState<Data>,
  withReset?: boolean
) => {
  const { pathname } = useLocation();
  const [data, setData] = useRecoilState(state);
  const resetData = useResetRecoilState(state);
  useEffect(() => {
    if (!data) {
      (async () => {
        const [[, init]] = await initialAction({ url: pathname });
        setData(init);
      })();
    }
    return () => {
      withReset ? resetData() : undefined;
    };
  }, [pathname]);

  return data;
};
