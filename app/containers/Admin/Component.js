import React from 'react';

// import { ConnectedRouter as Router } from 'connected-react-router/immutable';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const Admin = () => (
  <Router basename="/admin">
    <div>
      <Switch>
        <Route path="/" exact render={() => (<div>Main</div>)} />
        <Route path="/panel1" exact render={() => (<div>Panel1</div>)} />
        <Route path="/panel2" exact render={() => (<div>Panel2</div>)} />
      </Switch>
    </div>
  </Router>
);

export default Admin;
