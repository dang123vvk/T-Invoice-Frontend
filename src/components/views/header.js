import React, {Component} from 'react';
import { Link } from "react-router-dom";
import blue from '@material-ui/core/colors/blue';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Redirect } from 'react-router';;
const th = createMuiTheme({
  palette: {
    primary: { main: blue[500] }, 
    secondary: { main: '#2196f3' },
  },
});
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
        redirect: false,

    }
    // if((this.props.isLogin == false) &&( localStorage.getItem('role_id')==1))
    // {
    //     this.props.loginB('','','', true, true,false);
    // }
    // if((this.props.isLogin == false) &&( localStorage.getItem('role_id')==2))
    // {
    //     this.props.loginB('','', '',true, false,false);
    // }
    // if((this.props.isLogin == false) &&( localStorage.getItem('role_id')==3))
    // {
    //     this.props.loginB('','','', true, false, true);
    // }
}
 render() {
  const  redirect  = this.state.redirect;
  if (redirect) {
    return <Redirect to='/'/>;
  }
   
   if(localStorage.getItem('user_name'))
   {
     return (
      <div style={{ flexGrow: 1}}>
      <ThemeProvider theme={th}>
       <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1, color: 'white'}}>
            <Link to='/dashboard' style={{ color: 'white',textDecoration: 'none'}}>T-Invoice</Link>
          </Typography>
          <Link to='/profile' style={{ color: 'white',textDecoration: 'none'}}><Button color="inherit">{localStorage.getItem('user_name')}</Button></Link>
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
// const mapStateToProps = state => {
//   return {
//     title: state.loginReducer.username,
//     isLogin: state.loginReducer.isLogin
//   };
// };
//  const mapDispatchToProps = (dispatch) => ({
//      loginB: (username, password,token, isLogin, isAdmin, isSenior) => dispatch(loginAction(username, password,token, isLogin, isAdmin, isSenior))
 
//  });
export default Header;
