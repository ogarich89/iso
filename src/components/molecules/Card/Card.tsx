import { Link } from 'src/components/molecules/Link/Link';

import style from './Card.scss';

import type { FunctionComponent } from 'react';
import type { Product } from 'src/types';

export const Card: FunctionComponent<Product> = ({
  id,
  color,
  pantone_value,
  year,
  name,
}) => (
  <Link
    style={{ backgroundColor: color }}
    className={style.card}
    to={`/products/${id}`}
  >
    <div className={style.title}>
      <h4>{name}</h4>
    </div>
    <ul className={style.list}>
      <li>
        <strong>Color model: </strong>
        <span>{pantone_value}</span>
      </li>
      <li>
        <strong>Year: </strong>
        <span>{year}</span>
      </li>
    </ul>
  </Link>
);
