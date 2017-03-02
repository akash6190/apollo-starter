/**
 * Connecting react-tolbox and Link
 */

import React from 'react';
import Button from 'react-toolbox/lib/button';
import { Link } from 'react-router-dom';

class LinkButton extends Link {
  render() {
    const { replace, to, ...props } = this.props; // eslint-disable-line no-unused-vars

    const href = this.context.router.createHref(
      typeof to === 'string' ? { pathname: to } : to
    );

    return <Button {...props} onClick={this.handleClick} href={href} />;
  }
}

export default LinkButton;
