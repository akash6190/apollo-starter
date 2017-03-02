import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';

import Button from 'react-toolbox/lib/button';
import Link from 'components/Button';
import { logout } from './actions';
import { makeSelectToken } from './selectors';
import messages from './messages';

const LoginButton = (props) => {
  if (!props.token) {
    return (
      <Link to="/login" raised primary>
        <FormattedMessage {...messages.loginBtn} />
      </Link>
    );
  }

  return (<Button inverse onClick={props.logout}>Logout</Button>);
};

LoginButton.propTypes = {
  token: React.PropTypes.string,
  logout: React.PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  token: makeSelectToken(),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  logout,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LoginButton);
