import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { logout } from './actions';
import { makeSelectToken } from './selectors';
import messages from './messages';

const LoginButton = (props) => {
  if (!props.token) {
    return (
      <Link to="/login">
        <FormattedMessage {...messages.loginBtn} />
      </Link>
    );
  }

  return (<button onClick={props.logout}>Logged in</button>);
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
