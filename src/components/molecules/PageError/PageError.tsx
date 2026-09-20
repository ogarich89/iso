import type { FunctionComponent } from 'react';
import style from './PageError.module.scss';

interface Props {
  onRetry: () => void;
}

export const PageError: FunctionComponent<Props> = ({ onRetry }) => (
  <section className={style.pageError}>
    <strong>SOMETHING WENT WRONG</strong>
    <button type="button" onClick={onRetry}>
      TRY AGAIN
    </button>
  </section>
);
