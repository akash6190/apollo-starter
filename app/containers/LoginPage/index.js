/*
 *
 * LoginPage
 *
 */

import React, { PropTypes, PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { Redirect } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';

import styled from 'styled-components';
import { Card, CardText } from 'react-toolbox/lib/card';
import { Button } from 'react-toolbox/lib/button';

import LoginForm from './LoginForm';
import { makeSelectFlashMessages, makeSelectToken } from './selectors';
import { fetchFlashMessages } from './actions';
import messages from './messages';
import styles from './styles.css';
import fbTheme from './fb.css';
import gpTheme from './google.css';

const LoginWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export class LoginPage extends PureComponent {
  componentDidMount() {
    this.props.fetchFlashMessages();
  }

  getFlashMessage() {
    const { flashMessages } = this.props;
    if (!isEmpty(flashMessages) && !isEmpty(flashMessages.error)) {
      return flashMessages.error.map((m, i) => <FormattedMessage key={`${m}-${i}`} {...messages[m]} />); // eslint-disable-line react/no-array-index-key
    }
    return null;
  }

  startFacebookLogin() {
    window.open('/auth/facebook');
  }

  startGoogleLogin() {
    window.open('/auth/google');
  }

  render() {
    if (this.props.token) {
      const { location } = this.props; // eslint-disable-line react/prop-types
      const to = (location && location.state && location.state.from) ? location.state.from : '/';
      return (<Redirect to={to} replace />);
    }
    return (
      <LoginWrapper>
        <Helmet
          title="LoginPage"
          meta={[
            { name: 'description', content: 'Login page for apollo starter kit' },
          ]}
        />
        {this.getFlashMessage()}
        <Card className={styles.loginCard}>
          <CardText>
            <Button
              raised
              onClick={this.startFacebookLogin}
              label="Facebook"
              theme={fbTheme}
              className={styles.socialButton}
            />
            <Button
              raised
              onClick={this.startGoogleLogin}
              label="Google"
              theme={gpTheme}
              className={styles.socialButton}
            />
          </CardText>
          <CardText>
            <LoginForm />
          </CardText>
        </Card>
      </LoginWrapper>
    );
  }
}

LoginPage.propTypes = {
  token: PropTypes.string,
  fetchFlashMessages: PropTypes.func.isRequired,
  flashMessages: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  flashMessages: makeSelectFlashMessages(),
  token: makeSelectToken(),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchFlashMessages,
}, dispatch);

// function mapDispatchToProps(dispatch) {
//   return {
//     dispatch,
//   };
// }

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
