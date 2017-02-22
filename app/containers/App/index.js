/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { Switch, Route } from 'react-router';
import { ImmutableLoadingBar as LoadingBar } from 'react-redux-loading-bar';

import HomePage from 'containers/HomePage';
import FeaturePage from 'containers/FeaturePage';
import Header from 'components/Header';
import Footer from 'components/Footer';

const AppWrapper = styled.div`
  max-width: calc(768px + 16px * 2);
  margin: 0 auto;
  display: flex;
  min-height: 100%;
  padding: 0 16px;
  flex-direction: column;
`;

export function App() {
  return (
    <div>
      <LoadingBar style={{ position: 'fixed' }} />
      <AppWrapper>
        <Helmet
          titleTemplate="%s - React.js Boilerplate"
          defaultTitle="React.js Boilerplate"
          meta={[
            { name: 'description', content: 'A React.js Boilerplate application' },
          ]}
        />
        <Header />
        <Switch>
          <Route exact path={'/'} component={HomePage} />
          <Route path="/features" component={FeaturePage} />
        </Switch>
        <Footer />
      </AppWrapper>
    </div>
  );
}

export default App;
