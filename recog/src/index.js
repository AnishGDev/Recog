import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import {Router, Redirect, Route, Switch} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';

import Login from './pages/Login';
import Home from './pages/Home';
import Create from './pages/Create'
const customHist = createBrowserHistory();

const Main = () => {
  return (
    <Router history={customHist}>
      <Switch>
        <Route path="/create" component={Create}/>
        <Route path="/login" component={Login}/>
        <Route path="/app/home" component={Home}/>
        <Redirect from="/" to="/login"></Redirect>
      </Switch>
    </Router>
  )
}

ReactDOM.render(
  <Main />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
