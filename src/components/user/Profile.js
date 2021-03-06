import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { ThemeProvider } from '@material-ui/styles';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { loginAction } from '../reducers/action'
import { Grid } from '@material-ui/core';
import NotFound from "../views/NotFound";
import { th } from "../share/config";
import {postInformationCurrent, getInformationCurrent } from "../share/services/user.service";
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_fullname: '',
      user_username: '',
      user_oldpassword: '',
      user_password: '',
      user_confirm_password: '',
      user_group: '',
      redirect: false,
      error: false,
      disabled: true,
      user_email: '',
      message: '',
      isAdmin: false
    }
    this.save = this.save.bind(this);
    this.onChange = this.onChange.bind(this);
    this.confirmPassword = this.confirmPassword.bind(this);
    this.cancel = this.cancel.bind(this);
    document.title = 'Edit Profile';
    
  }
  UNSAFE_componentWillMount(){
    getInformationCurrent(this.props.user_username,this.props.token).then(data => {
        this.setState({
          user_fullname: data.user.user_fullname,
          user_username: data.user.user_username,
          user_email: data.user.user_email,
          user_group: data.user.groups_user_name
        })
        
    });
    if(this.props.role === 'Admin'){
      this.setState({
        isAdmin: true
      })

    }
  }
  save(event) {
    event.preventDefault();
    const user = { user_fullname: this.state.user_fullname, 
                    user_oldpassword: this.state.user_oldpassword,
                    user_password: this.state.user_password};
    if((this.state.user_oldpassword.length >0 ) && (this.state.error=== false)){
      postInformationCurrent(this.state.user_username,user, this.props.token).then(data => {
        if(data.status){
          this.setState({
            message: data.message
          })
          var user_information = {};
          user_information.user_fullname = this.state.user_fullname;
          user_information.user_username = JSON.parse(localStorage.getItem("user_information")).user_username;
          user_information.token = JSON.parse(localStorage.getItem("user_information")).token;
          user_information.role = JSON.parse(localStorage.getItem("user_information")).role;
          localStorage.setItem('user_information', JSON.stringify(user_information));
          this.props.login(this.state.user_fullname,user_information.user_username,user_information.token, user_information.role, this.props.group)
        }
        else {
          this.setState({
            message: data.message
          })
        }
        
      });
    }
    else {
      this.setState({
        message: 'Please enter the password'
      })
    }
  }
  onChange(e) {
    e.preventDefault();
    this.setState({  [e.target.name]: e.target.value,
    disabled: false });
  }
  confirmPassword(e) {
    e.preventDefault();
    this.setState({
        [e.target.name]: e.target.value
    });
    if (e.target.value === this.state.user_password) {
      this.setState({
        message: '',
        error: false
      })
    }
    else {
      this.setState({
       error: true
      })
    }
  }
  cancel(e) {
    e.preventDefault();
    this.setState({
      redirect: true
    })
  }
  render() {
    const redirect = this.state.redirect;
    if (redirect) {
      return <Redirect to='/' />;
    }
    if ((this.props.role) || (localStorage.getItem('user_information'))) {
      return (
        <ThemeProvider theme={th}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div style={{ marginTop: '2%', display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
              <Avatar style={{ backgroundColor: '#3f51b5', margin: 1 }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Edit Profile
              </Typography>
              <Typography style={{ color: 'red' }}>
                {this.state.message}
              </Typography>
              <form style={{ width: '100%', marginTop: 1 }} validate="true" onSubmit={event => this.editUser(event)}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="user_name"
                      label="User Full Name"
                      name="user_fullname"
                      type="text"
                      value={this.state.user_fullname}
                      onChange={this.onChange}
                      size='small'
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="user_username"
                      label="User Name"
                      name="user_username"
                      type="text"
                      value={this.state.user_username}
                      disabled
                      size='small'
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="user_email"
                      label="Email"
                      name="user_email"
                      type="email"
                      value={this.state.user_email}
                      disabled
                      size='small'
                    />
                  </Grid>
                  <Grid item xs={12} hidden ={this.state.isAdmin}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      id="user_group"
                      label="Group"
                      name="user_group"
                      type="text"
                      value={this.state.user_group}
                      disabled
                      size='small'
                    />
                  </Grid>    
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      name="user_oldpassword"
                      label="Current Password"
                      type="password"
                      id="user_oldpassword"
                      onChange={this.onChange}
                      size='small'
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      name="user_password"
                      label="New Password"
                      type="password"
                      id="user_password"
                      onChange={this.onChange}
                      size='small'
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      name="user_confirm_password"
                      label="Confirm New Password"
                      type="password"
                      onChange={this.confirmPassword}
                      error={this.state.error}
                      size='small'
                    />
                  </Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={4}>
                    <Button
                      type="button"
                      fullWidth
                      variant="contained"
                      color="secondary"
                      style={{ marginTop: '2%', backgroundColor: 'red', color: 'white' }}
                      onClick={this.cancel}
                    >
                      Cancel
                </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      style={{ marginTop: '2%' }}
                      onClick={this.save}
                      disabled={this.state.disabled}
                    >
                      Save
                  </Button>
                  </Grid>
                  <Grid item xs={2}></Grid>
                </Grid>
              </form>
            </div>
          </Container>
        </ThemeProvider>
      );
    }
    return (
      <NotFound />
    )
  }
}
const mapStateToProps = (state) => {
  return {
    user_fullname: state.loginReducer.user_fullname,
    user_username: state.loginReducer.user_username,
    role: state.loginReducer.role,
    token: state.loginReducer.token,
    group: state.loginReducer.group
  };
}
const mapDispatchToProps = (dispatch) => ({
  login: (user_fullname,user_username,token, role, group) => dispatch(loginAction(user_fullname,user_username, token,role, group))
});

export default connect(mapStateToProps,mapDispatchToProps)(Profile);