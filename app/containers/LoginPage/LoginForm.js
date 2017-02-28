import React, { PureComponent, PropTypes } from 'react';
import { Form, Field, reduxForm } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from 'react-toolbox/lib/button';

import Input from 'components/Input';

import { login } from './actions';
import { LOGIN_FORM } from './constants';
import messages from './messages';

class LoginForm extends PureComponent {
  constructor(...props) {
    super(...props);
    this.submit = this.submit.bind(this);
  }

  submit(values) {
    const { login } = this.props; // eslint-disable-line no-shadow
    return new Promise((resolve, reject) => {
      login(
        values.get('username'),
        values.get('password'),
        { resolve, reject }
      );
    });
    // this.props.submit(username, password);
  }

  render() {
    const { error, handleSubmit, pristine, submitting } = this.props; // eslint-disable-line react/prop-types
    return (
      <Form onSubmit={handleSubmit(this.submit)}>
        {error}
        <Field
          type="text"
          name="username"
          label={'Username'}
          component={Input}
          props={{
            hint: 'Enter your username or email here.',
          }}
        />
        <Field
          type="password"
          name="password"
          label={'Password'}
          component={Input}
          props={{
            hint: 'Enter your password here.',
          }}
        />
        <Button primary raised type="submit" disabled={submitting || pristine}>
          <FormattedMessage {...(submitting ? messages.submitting : messages.loginBtn)} />
        </Button>
      </Form>
    );
  }
}

LoginForm.propTypes = {
  login: PropTypes.func,
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  login,
}, dispatch);

export default reduxForm({
  form: LOGIN_FORM,
})(connect(null, mapDispatchToProps)(LoginForm));
