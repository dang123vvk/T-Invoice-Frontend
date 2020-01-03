import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Route,   Switch} from "react-router-dom";
import HomePage from './components/views/index';
import Header from './components/views/header'
const routing = (
    <Router>
      <div >
        <Header />
        <Switch>
        <Route path="/" component={HomePage} />
        </Switch>
      </div>
    </Router>
    
  )

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
