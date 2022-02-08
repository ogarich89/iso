import type { FunctionComponent } from 'react';
import { useEffect, useState } from 'react';
import style from './Loading.scss';

interface Props { timeout: number }

export const Loading: FunctionComponent<Props> = ({ timeout }) => {
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if(timeout) {
      setTimer(setTimeout(() => setIsActive(true), timeout))
    } else {
      setIsActive(true);
    }
    return () => {
      if(timer) clearTimeout(timer);
    }
  }, []);
  if(isActive) {
    return (
      <section className={style.loading}>
        <strong>LOADING...</strong>
      </section>
    );
  }
  return null;
}
