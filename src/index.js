import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Route,   Switch} from "react-router-dom";
import HomePage from './components/views/Home';
import Signin from './components/user/Signin';
import Profile from './components/user/Profile';
import Header from './components/views/Header';
import ListAccountBank from './components/accountbank/List';
import AddAccountBank from './components/accountbank/Add';
import EditAccountBank from './components/accountbank/Edit';
import { Provider } from 'react-redux'
import store from './components/reducers/store';
const routing = (
  <Provider store={store}>
    <Router>
      <div >
        <Header />
        <Switch>
        <Route exact path="/accountbanks" component={ListAccountBank} />
        <Route exact path="/accountbanks/add" component={AddAccountBank} />
        <Route exact path="/accountbanks/edit/" component={EditAccountBank} />
        <Route exact path="/signin" component={Signin} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/" component={HomePage} />
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
