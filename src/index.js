import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Route,   Switch} from "react-router-dom";
import HomePage from './components/views/Home';
import Signin from './components/user/Signin';
import Profile from './components/user/Profile';
import AdminDashboardUser from './components/auth/Admin';
import Listpayment from './components/payment/List';
import SeniorDashboard from './components/views/Senior';
import SeniorUser from './components/user/List.Senior';
import Header from './components/views/Header';
import AdminDashboard from './components/views/Admin';
import NotFound from './components/views/NotFound';
import ListAccountBank from './components/accountbank/List';
import ListBill from './components/bill/List';
import ListBillSenior from './components/bill/Bill.Senior';
import ResultBill from './components/bill/Bill.Reseult';
import ResultBillNotSent from './components/bill/Bill.Not.Sent';
import DetailBill from './components/bill/Detail';
import DetailBillSenior from './components/bill/Detail.Senior';
import AddBill from './components/bill/Add';
import EditBill from './components/bill/Edit';
import AddBillCustomer from './components/bill/Add.Customer';
import ListCustomer from './components/customer/List';
import ListCustomerSenior from './components/customer/Customer.Senior';
import AddCustomer from './components/customer/Add';
import EditCustomer from './components/customer/Edit';
import DetailCustomer from './components/customer/Detail';
import DetailCustomerSenior from './components/customer/Detail.Senior';
import AddAccountBank from './components/accountbank/Add';
import EditUser from './components/user/Edit';
import AddUser from './components/user/Add';
import AddDirector from './components/user/Add.Senior';
import EditDirector from './components/user/Edit.Senior';
import ListGroup from './components/group/List';
import AddGroup from './components/group/Add';
import EditGroup from './components/group/Edit';
import ListUserGroup from './components/group/User.Group';
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
        <Route exact path="/admin/" component={AdminDashboard} />
        <Route exact path="/admin/groups/add" component={AddGroup} />
        <Route exact path="/admin/groups/edit/:id" component={EditGroup} />
        <Route exact path="/admin/groups" component={ListGroup} />
        <Route exact path="/admin/groups/users/:id" component={ListUserGroup} />
        <Route exact path="/admin/exchange-rates" component={Listpayment} />
        <Route exact path="/admin/users" component={AdminDashboardUser} />
        <Route exact path="/admin/users/edit/:id" component={EditUser} />
        <Route exact path="/admin/users/add" component={AddUser} />
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
        <Route exact path="/senior" component={SeniorDashboard} />
        <Route exact path="/senior/bills" component={ListBillSenior} />
        <Route exact path="/senior/bills/export/:id" component={DetailBillSenior} />
        <Route exact path="/senior/customers" component={ListCustomerSenior} />
        <Route exact path="/senior/customers/detail/:id" component={DetailCustomerSenior} />
        <Route exact path="/senior/directors" component={SeniorUser} />
        <Route exact path="/senior/directors/add" component={AddDirector} />
        <Route exact path="/senior/directors/edit/:id" component={EditDirector} />
        <Route exact path="/signin" component={Signin} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/" component={HomePage} />
        <Route component={NotFound} />
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
