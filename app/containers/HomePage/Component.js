/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';

import H2 from 'components/H2';
import CenteredSection from './CenteredSection';
import Section from './Section';
import messages from './messages';

class HomePage extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <article>
        <Helmet
          title="Home Page"
          meta={[
            { name: 'description', content: 'A React.js Boilerplate application homepage' },
          ]}
        />
        <div>
          <CenteredSection>
            <H2>
              <FormattedMessage {...messages.startProjectHeader} />
            </H2>
            <p>
              <FormattedMessage {...messages.startProjectMessage} />
            </p>
          </CenteredSection>
          <Section>
            <H2>
              <FormattedMessage {...messages.trymeHeader} />
            </H2>
          </Section>
        </div>
      </article>
    );
  }
}

// Wrap the component to inject dispatch and state into it
export default HomePage;
