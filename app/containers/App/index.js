/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { bindActionCreators } from 'redux';
import { Switch, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Helmet from 'react-helmet';

import { AppBar } from 'react-toolbox/lib/app_bar';
import { NavDrawer, Layout, Panel } from 'react-toolbox/lib/layout';
import Navigation from 'react-toolbox/lib/navigation';
import { Button, IconButton } from 'react-toolbox/lib/button';
import { ImmutableLoadingBar as LoadingBar } from 'react-redux-loading-bar';

import HomePage from 'containers/HomePage';
import FeaturePage from 'containers/FeaturePage';
import NotFoundPage from 'containers/NotFoundPage';

// import Header from 'components/Header';
import Footer from 'components/Footer';
import NavLink from 'components/Link';

import { toggleDrawer } from './actions';
import { makeSelectDrawer } from './selectors';


const App = (props) => (
  <Layout>
    <Helmet
      titleTemplate="%s - React.js Boilerplate"
      defaultTitle="React.js Boilerplate"
      meta={[
        { name: 'description', content: 'Apollo starter Boilerplate' },
      ]}
    />

    <LoadingBar style={{ position: 'fixed', zIndex: 102 }} />
    <NavDrawer pinned={props.open}>
      <p>
        <IconButton icon={'arrow_back'} onClick={props.toggleDrawer} />
      </p>
      <Switch>
        <Route exact path={'/'} component={() => <p>Home Page</p>} />
        <Route component={() => <p>Default navbar</p>} />
      </Switch>
    </NavDrawer>
    <AppBar
      fixed
      rightIcon={'more'}
      onLeftIconClick={props.toggleDrawer}
      title="Apollo Starter"
    >
      <Navigation type="horizontal">
        <NavLink to={'/features'} >Features</NavLink>
        <Button icon="lock" label="Sign In" primary raised href={'/login'} />
      </Navigation>
    </AppBar>
    <Panel>
      <section style={{ margin: '1.8rem' }}>
        <Link to={'/'}>Home</Link>
        <Link to={'/features'}>Features</Link>
        <Switch>
          <Route exact path={'/'} component={HomePage} />
          <Route path="/features" component={FeaturePage} />
          <Route component={NotFoundPage} />
        </Switch>
      </section>
      <Footer />
    </Panel>
  </Layout>
);

App.propTypes = {
  toggleDrawer: React.PropTypes.func.isRequired,
  open: React.PropTypes.bool.isRequired,
};

const mapStateToProps = createStructuredSelector({
  open: makeSelectDrawer(),
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  toggleDrawer,
}, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(App);
