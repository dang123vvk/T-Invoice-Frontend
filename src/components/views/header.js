import React, {Component} from 'react';
import { Link } from "react-router-dom";
import { ThemeProvider } from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Redirect } from 'react-router';
import Logout from '../user/Logout';
import { connect } from 'react-redux';
import { loginAction } from '../reducers/action';
import { th } from "../share/config";
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
        redirect: false,

    }
   if(localStorage.getItem('user_information')){
    var user_information = JSON.parse(localStorage.getItem("user_information"));
    this.props.login(user_information.user_fullname,user_information.user_username,user_information.token, user_information.role);
   }
}
 render() {
  const  redirect  = this.state.redirect;
  if (redirect) {
    return <Redirect to='/'/>;
  }
   
   if(localStorage.getItem('user_information') || (this.props.isLogin.length > 0))
   {
     return (
      <div style={{ flexGrow: 1}}>
      <ThemeProvider theme={th}>
       <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1, color: 'white'}}>
            <Link to='/' style={{ color: 'white',textDecoration: 'none'}}>T-Invoice</Link>
          </Typography>
          <Link to='/profile' style={{ color: 'white',textDecoration: 'none'}}><Button color="inherit">{this.props.user_fullname}</Button></Link>
          <Logout />
        </Toolbar>
      </AppBar>
      </ThemeProvider>
      </div>
     );
   }
   else {
  return (
    <div style={{ flexGrow: 1}}>
      <ThemeProvider theme={th}>
       <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1, color: 'white'}}>
            <Link to='/' style={{ color: 'white',textDecoration: 'none'}}>T-Invoice</Link>
          </Typography>
          <Link to='/signin' style={{ color: 'white',textDecoration: 'none'}}><Button color="inherit">Sign In</Button></Link>
        </Toolbar>
      </AppBar>
      </ThemeProvider>
      </div>
  );
}
 }
}
const mapStateToProps = state => {
  return {
    user_fullname: state.loginReducer.user_fullname,
    isLogin: state.loginReducer.role
  };
};
 const mapDispatchToProps = (dispatch) => ({
  login: (user_fullname,user_username,token, role) => dispatch(loginAction(user_fullname,user_username, token,role))
 });
export default connect(mapStateToProps, mapDispatchToProps)  (Header);
