import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { ThemeProvider } from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Redirect } from 'react-router';
import Logout from '../user/Logout';
import { connect } from 'react-redux';
import { loginAction } from '../reducers/action';
import { th } from "../share/config";
import MenuIcon from '@material-ui/icons/Menu';
import { IconButton } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ReceiptIcon from '@material-ui/icons/Receipt';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SettingsIcon from '@material-ui/icons/Settings';


class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      left: false,

    }
    if (localStorage.getItem('user_information')) {
      var user_information = JSON.parse(localStorage.getItem("user_information"));
      this.props.login(user_information.user_fullname, user_information.user_username, user_information.token, user_information.role);
    }
    this.toggleDrawer = this.toggleDrawer.bind(this);
  }
  sideList = side => (
    <div
      role="presentation"
      onClick={this.toggleDrawer(side, false)}
      onKeyDown={this.toggleDrawer(side, false)}
    >
      <List>
        <Link to='/' style={{ textDecoration: 'none' }}>
          <ListItem button >
            <ListItemIcon><HomeOutlinedIcon style={{ color: '#546e7a'}} /></ListItemIcon>
            <ListItemText style={{ color: '#263238'}} primary='Home' />
          </ListItem>
        </Link>
      </List>
      <Divider />
      <List>
      <Link to='/' style={{ textDecoration: 'none' }}>
          <ListItem button  >
            <ListItemIcon><DashboardIcon style={{ color: '#546e7a'}} /></ListItemIcon>
            <ListItemText style={{ color: '#263238'}} primary='Dashboard' />
          </ListItem>
        </Link>
        <Link to='/accountbanks' style={{ textDecoration: 'none' }}>
          <ListItem button >
            <ListItemIcon><AccountBalanceIcon style={{ color: '#546e7a'}} /></ListItemIcon>
            <ListItemText style={{ color: '#263238'}} primary='Account Bank' />
          </ListItem>
        </Link>
        <Link to='/customers' style={{ textDecoration: 'none' }}>
          <ListItem button >
            <ListItemIcon><SupervisorAccountIcon style={{ color: '#546e7a'}} /></ListItemIcon>
            <ListItemText style={{ color: '#263238'}} primary='Customers' />
          </ListItem>
        </Link>
        <Link to='/bills' style={{ textDecoration: 'none' }}>
          <ListItem button >
            <ListItemIcon><ReceiptIcon style={{ color: '#546e7a'}} /></ListItemIcon>
            <ListItemText style={{ color: '#263238'}} primary='Bills' />
          </ListItem>
        </Link>
        <Link to='/profile' style={{ textDecoration: 'none' }}>
          <ListItem button >
            <ListItemIcon><AccountBoxIcon style={{ color: '#546e7a'}} /></ListItemIcon>
            <ListItemText style={{ color: '#263238'}} primary='Profile' />
          </ListItem>
        </Link>
        <Link to='/settings' style={{ textDecoration: 'none' }}>
          <ListItem button >
            <ListItemIcon><SettingsIcon style={{ color: '#546e7a'}} /></ListItemIcon>
            <ListItemText style={{ color: '#263238'}} primary='Settings' />
          </ListItem>
        </Link>
      </List>
    </div>
  );
  toggleDrawer = (side, open) => event => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    this.setState({
      [side]: open
    })
  };
  render() {
    const redirect = this.state.redirect;
    if (redirect) {
      return <Redirect to='/' />;
    }
    if (localStorage.getItem('user_information') || (this.props.isLogin.length > 0)) {
      return (
        <div style={{ flexGrow: 1 }}>
          <ThemeProvider theme={th}>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1, color: 'white' }}>
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    className='btn-without-border'
                    onClick={this.toggleDrawer('left', true)}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Link to='/' style={{ color: 'white', textDecoration: 'none' }}>T-Invoice</Link>
                </Typography>
                <Link to='/profile' style={{ color: 'white', textDecoration: 'none' }}><Button color="inherit">{this.props.user_fullname}</Button></Link>
                <Logout />
              </Toolbar>
            </AppBar>
            <SwipeableDrawer
              open={this.state.left}
              onClose={this.toggleDrawer('left', false)}
              onOpen={this.toggleDrawer('left', true)}
            >
              {this.sideList('left')}
            </SwipeableDrawer>
          </ThemeProvider>
        </div>
      );
    }
    else {
      return (
        <div style={{ flexGrow: 1 }}>
          <ThemeProvider theme={th}>
            <AppBar position="static">
              <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1, color: 'white' }}>
                  <Link to='/' style={{ color: 'white', textDecoration: 'none' }}>T-Invoice</Link>
                </Typography>
                <Link to='/signin' style={{ color: 'white', textDecoration: 'none' }}><Button color="inherit">Sign In</Button></Link>
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
  login: (user_fullname, user_username, token, role) => dispatch(loginAction(user_fullname, user_username, token, role))
});
export default connect(mapStateToProps, mapDispatchToProps)(Header);
