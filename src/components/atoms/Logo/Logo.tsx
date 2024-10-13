import { Link } from 'src/components/molecules/Link/Link';

import style from './Logo.scss';

export const Logo = () => {
  return (
    <div className={style.logo}>
      <Link to="/">
        ISO<small>JS</small>
      </Link>
    </div>
  );
};
