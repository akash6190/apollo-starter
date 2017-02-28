import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { Route, Redirect } from 'react-router-dom';

import { makeSelectToken } from './selectors';

/* eslint-disable react/prop-types */
const PrivateRoute = ({ component, token, ...rest }) => (
  <Route
    {...rest}
    render={(props) => (
      token ? React.createElement(component, props) : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location },
          }}
        />)
      )
    }
  />
);

const mapStateToProps = createStructuredSelector({
  token: makeSelectToken(),
});

export default connect(mapStateToProps)(PrivateRoute);
