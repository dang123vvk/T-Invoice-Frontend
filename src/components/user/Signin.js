import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import blue from '@material-ui/core/colors/blue';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { loginAction } from '../reducers/action';
import { signIn } from '../share/services/user.service';

const th = createMuiTheme({
  palette: {
    primary: { main: blue[500] }, // Purple and green play nicely together.
    secondary: { main: '#2196f3' }, // This is just green.A700 as hex.
  },
});
class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      user_password: '',
      redirect: false,
      tokenVN: '',
      isLoading: false,
      message: ''
    }
    this.signin = this.signin.bind(this);
    this.onChange = this.onChange.bind(this);
    document.title = 'Sign In';
  }
  signin(event) {
    event.preventDefault();
    const user = { user_username: this.state.username, user_password: this.state.user_password };
    signIn(user).then(data => {
      if (data.status === true) {
        this.setState({redirect: true});
        var user_information = {};
        user_information.user_fullname = data.user_fullname;
        user_information.user_username = data.user_username;
        user_information.token = data.token;
        user_information.role = data.role;
        localStorage.setItem('user_information', JSON.stringify(user_information));
        localStorage.setItem('user_id',data.user_id);
        this.props.login(data.user_fullname,data.user_username, data.token,data.role);
      }
      else {
        this.setState({message: data.message})
      }
    });
  }
  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
  render() {
    const redirect = this.state.redirect;
    if (redirect) {
      return <Redirect to='/' />;
    }
    if ((this.props.isLogin) || (localStorage.getItem('user_name'))) {
      return (
        <Container component="main">
          <CssBaseline />
          <div style={{ marginTop: '6%', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h4" style={{ color: 'rgb(23, 105, 170)', marginTop: '6%', marginBottom: '6%' }}>
              You are already logged
                                </Typography>
          </div>
        </Container>
      );
    }
    return (
      <ThemeProvider theme={th}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div style={{ marginTop: '6%', display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
            <Avatar style={{ backgroundColor: '#2196f3', margin: 1 }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
        </Typography>
            <Typography style={{ color: 'red' }}>
              {this.state.message}
            </Typography>
            <form style={{ width: '100%', marginTop: 1 }} validate="true" onSubmit={event => this.signin(event)}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="user_name"
                label="User Name"
                name="username"
                type="text"
                onChange={this.onChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="user_password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={this.onChange}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="secondary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                style={{ margin: '3,0,2' }}
              >
                Sign In
          </Button>
              <Grid container direction="row"
                justify="center"
                alignItems="center">
              </Grid>
            </form>
          </div>
        </Container>
      </ThemeProvider>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    user_fullname: state.loginReducer.user_fullname,
    role: state.loginReducer.role,
    token: state.loginReducer.token
  };
}
const mapDispatchToProps = (dispatch) => ({
  login: (user_fullname,user_username,token, role) => dispatch(loginAction(user_fullname,user_username, token,role))
});
export default connect(mapStateToProps, mapDispatchToProps)(Signin);