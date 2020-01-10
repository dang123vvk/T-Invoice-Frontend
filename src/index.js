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
import ListBill from './components/bill/list';
import ResultBill from './components/bill/bill.result';
import ResultBillNotSent from './components/bill/bill.not.sent';
import DetailBill from './components/bill/detail';
import AddBill from './components/bill/add';
import EditBill from './components/bill/edit';
import AddBillCustomer from './components/bill/add.customer';
import ListCustomer from './components/customer/list';
import AddCustomer from './components/customer/add';
import EditCustomer from './components/customer/edit';
import DetailCustomer from './components/customer/detail';
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
        <Route exact path="/bills" component={ListBill} />
        <Route exact path="/bills/search/customer/:customer_id?/(status)?/:status_id?/(date_from)?/:date_from?/(date_to)?/:date_to?" component={ResultBill} />
        <Route exact path="/bills/status/notsent" component={ResultBillNotSent} />
        <Route exact path="/bills/add" component={AddBill} />
        <Route exact path="/bills/edit/:id" component={EditBill} />
        <Route exact path="/bills/add/customer/:id" component={AddBillCustomer} />
        <Route exact path="/bills/export/:id" component={DetailBill} />
        <Route exact path="/customers" component={ListCustomer} />
        <Route exact path="/customers/add" component={AddCustomer} />
        <Route exact path="/customers/edit/:id" component={EditCustomer} />
        <Route exact path="/customers/detail/:id" component={DetailCustomer} />
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
