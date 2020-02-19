import React, {Fragment, useEffect} from 'react';
import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Routes from './components/routing/Routes';
import {Router, Route, Switch} from 'react-router-dom'
//Redux
import { Provider } from 'react-redux'
import store from './store'
import {loadUser} from './actions/auth'
import setAuthToken from './utils/setAuthToken'
import { createBrowserHistory } from "history";

import './App.css';

if(sessionStorage.token) {
  setAuthToken(sessionStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser())
  },[])
  const history = createBrowserHistory();

  return (
  <Provider store={store}>
  <Router history={history}>
    <Fragment>
      <Navbar />
      <Switch>
        <Route exact path='/' component={Landing} />
        <Route component={Routes} />
      </Switch>
    </Fragment>
  </Router>
  </Provider>
)}

export default App;
