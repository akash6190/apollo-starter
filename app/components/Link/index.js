import React from 'react';
import { NavLink } from 'react-router-dom';
import theme from './theme.css';

const Link = ({ to, replace, children, ...others }) => { // eslint-disable-line react/prop-types
  return (
    <NavLink to={to} replace={replace} activeClassName={theme.active} {...others}>
      {children}
    </NavLink>
  );
};

export default Link;
