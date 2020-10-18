import type { FunctionComponent } from 'react';
import React from 'react';
import style from './About.scss';

export const About: FunctionComponent<{ data: any }> = () => (
  <div className={style.about}>
    <div className={style.title}>
      <h4>About ISO starter-pack</h4>
    </div>
    <div className={style.textContainer}>
      <p>Iso is starter-pack for creating isomorphic single-page application with using SSR technology on NodeJS.</p>
      <p>Powered by <a href="https://github.com/ogarich89" target="_blank">ogarich89</a></p>
    </div>
  </div>
);
