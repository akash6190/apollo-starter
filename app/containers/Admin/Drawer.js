import React from 'react';
import { BrowserRouter as Router, Route, Switch, NavLink as Link } from 'react-router-dom';

const Drawer = () => (
  <Router basename="/admin">
    <div>
      <Link to="/panel1">Panel1</Link>
      <Link to="/panel2">Panel2</Link>
      <Switch>
        <Route path="/panel1" render={() => <div>Panel1</div>} />
        <Route path="/panel2" render={() => <div>Panel2</div>} />
      </Switch>
    </div>
  </Router>
);

export default Drawer;
