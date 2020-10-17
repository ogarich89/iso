import React, { FunctionComponent } from 'react';
import type { IProduct } from '../../../../types';
import style from './Card.scss';
import { Link } from 'react-router-dom';

export const Card: FunctionComponent<IProduct> = ({ id, color, pantone_value, year, name }) => (
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
