/*
 * LoginPage Messages
 *
 * This contains all the text for the LoginPage component.
 */
import { defineMessages } from 'react-intl';

const PREFIX = 'app.containers.LoginPage';

export default defineMessages({
  header: {
    id: `${PREFIX}.header`,
    defaultMessage: 'This is LoginPage container !',
  },
  FB_EMAIL_PERMISSION_REQUIRED: {
    id: `${PREFIX}.fbEmailError`,
    defaultMessage: 'You cannot login without an email, please try to login with FB again.',
  },
  loginBtn: {
    id: `${PREFIX}.loginBtn`,
    defaultMessage: 'Log In',
  },
  submitting: {
    id: `${PREFIX}.submitting`,
    defaultMessage: 'Submitting...',
  },
  signin: {
    id: `${PREFIX}.signin`,
    defaultMessage: 'Sign In',
  },
});
