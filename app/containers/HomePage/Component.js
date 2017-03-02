/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React, { PureComponent, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { graphql, compose } from 'react-apollo';

import H2 from 'components/H2';
import CenteredSection from './CenteredSection';
import Section from './Section';
import messages from './messages';
import getCount from './getCount.gql';
import countUpdates from './countUpdates.gql';

class HomePage extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const { countData: data, updateData } = this.props;

    if (data.loading) {
      return (<article>
        Loading...
      </article>);
    }

    if (!(updateData.loading) && updateData.countUpdated.amount !== data.count.amount) {
      data.refetch();
    }
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
            {data.count.amount}
          </Section>
        </div>
      </article>
    );
  }
}

HomePage.propTypes = {
  countData: PropTypes.any,
  updateData: PropTypes.any,
};

// Wrap the component to inject dispatch and state into it
export default compose(
  graphql(countUpdates, { name: 'updateData' }),
  graphql(getCount, { name: 'countData' }),
)(HomePage);
