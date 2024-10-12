import { NavLink, matchPath } from 'react-router-dom';
import routes from 'src/routes';

import type { FunctionComponent, MouseEventHandler } from 'react';
import type { NavLinkProps } from 'react-router-dom';

export const Link: FunctionComponent<NavLinkProps> = ({
  style,
  to,
  className,
  children,
}) => {
  const mouseOverHandler: MouseEventHandler = () => {
    routes.forEach(({ children }) => {
      children?.forEach(({ path, component }) => {
        if (matchPath(path, to as string) && path !== '*') {
          component.preload();
        }
      });
    });
  };
  return (
    <NavLink
      style={style}
      to={to}
      className={className}
      onMouseOver={mouseOverHandler}
    >
      {children}
    </NavLink>
  );
};
