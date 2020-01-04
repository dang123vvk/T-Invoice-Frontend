import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Route,   Switch} from "react-router-dom";
import HomePage from './components/views/index';
import Signin from './components/user/signin';
import Profile from './components/user/profile';
import Header from './components/views/header';
import { Provider } from 'react-redux'
import store from './components/reducers/store';
const routing = (
  <Provider store={store}>
    <Router>
      <div >
        <Header />
        <Switch>
        <Route path="/signin" component={Signin} />
        <Route path="/profile" component={Profile} />
        <Route path="/" component={HomePage} />
        </Switch>
      </div>
    </Router>
    </Provider>
    
  )

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
