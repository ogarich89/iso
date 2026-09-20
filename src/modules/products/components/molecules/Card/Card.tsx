import type { FunctionComponent } from 'react';
import { Link } from 'src/components/molecules/Link/Link';
import { isLightColor } from 'src/lib/color';
import type { Product } from 'src/modules/products/types';
import style from './Card.module.scss';

export const Card: FunctionComponent<Product> = ({ id, color, pantone_value, year, name }) => (
  <Link
    style={{ backgroundColor: color, color: isLightColor(color) ? '#000000' : '#ffffff' }}
    className={style.card}
    to={`/products/${id}`}
  >
    <div className={style.title}>
      <h2>{name}</h2>
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
