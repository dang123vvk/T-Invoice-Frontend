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
import { Grid, FormControl, Select, MenuItem, InputLabel } from '@material-ui/core';
import NotFound from "../views/NotFound";
import { th } from "../share/config";
import { postAddUserFromAdmin } from "../share/services/user.service";
import { getGroupFromAdmin, getRoleFromAdmin } from "../share/services/group.service";
class AddUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_fullname: '',
      user_username: '',
      user_oldpassword: '',
      user_password: '',
      user_email: '',
      user_confirm_password: '',
      redirect: false,
      error: false,
      disabled: true,
      message: '',
      groups_user_id: 1,
      groups: [],
      roles: [],
      role_id: 1
    }
    this.save = this.save.bind(this);
    this.onChange = this.onChange.bind(this);
    this.confirmPassword = this.confirmPassword.bind(this);
    this.cancel = this.cancel.bind(this);
    document.title = 'Add User';
    this.handleChangeGroup = this.handleChangeGroup.bind(this);
    this.handleChangeRole = this.handleChangeRole.bind(this);
  }
  UNSAFE_componentWillMount(){
    getGroupFromAdmin(this.props.role, this.props.token).then(data =>{
      this.setState({
        groups: data.groups,
        groups_user_id: Number(data.groups[0].groups_user_id)
      })
  
    })
    getRoleFromAdmin(this.props.role, this.props.token).then(data =>{
      this.setState({
        roles: data.roles,
        role_id: data.roles[0].role_id
      })
  
    })
  }
  save(event) {
    event.preventDefault();
    const user = {
      user_fullname: this.state.user_fullname,
      user_username: this.state.user_username,
      user_email: this.state.user_email,
      user_password: this.state.user_password,
      groups_user_id: this.state.groups_user_id,
      role_id: this.state.role_id
    };
    if (this.state.user_confirm_password !== this.state.user_password) {
      this.setState({
        message: 'Please enter confirm  password'
      })
    }
    else {
      postAddUserFromAdmin(user, this.props.role, this.props.token).then(data => {
        if (data.status) {
          this.setState({
            message: data.message
          })
        }
        else {
          this.setState({
            message: data.message
          })
        }

      });
    }

  }
  onChange(e) {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value,
      disabled: false
    });
  }
  confirmPassword(e) {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    });
    if (e.target.value === this.state.user_password) {
      this.setState({
        message: '',
        error: false,
        disabled: false

      })
    }
    else {
      this.setState({
        error: true,
        disabled: true
      })
    }
  }
  cancel(e) {
    e.preventDefault();
    this.setState({
      redirect: true
    })
  }
  handleChangeGroup(event) {
    var value = event.target.value;
    this.setState({
      groups_user_id: value
    });
  }
  handleChangeRole(event) {
    var value = event.target.value;
    this.setState({
      role_id: value
    });

  }
  render() {
    const redirect = this.state.redirect;
    if (redirect) {
      return <Redirect to='/admin/users' />;
    }
    if ((this.props.role === 'Admin') && (localStorage.getItem('user_information'))) {
      return (
        <ThemeProvider theme={th}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div style={{ marginTop: '2%', display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
              <Avatar style={{ backgroundColor: '#3f51b5', margin: 1 }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Add User
              </Typography>
              <Typography style={{ color: 'red' }}>
                {this.state.message}
              </Typography>
              <form style={{ width: '100%', marginTop: 1 }} validate="true" onSubmit={event => this.save(event)}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      id="user_fullname"
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
                      id="user_name"
                      label="User Name"
                      name="user_username"
                      type="text"
                      value={this.state.user_username}
                      required
                      size='small'
                      onChange={this.onChange}
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
                      size='small'
                      required
                      onChange={this.onChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                  <FormControl fullWidth >
                      <InputLabel htmlFor="name-disabled">Role</InputLabel>
                      <Select value={this.state.role_id}
                        onChange={event => this.handleChangeRole(event)}>
                        {this.state.roles.map(role => (
                          <MenuItem key={role.role_id} value={role.role_id} >
                            {role.role_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                  <FormControl fullWidth >
                      <InputLabel htmlFor="name-disabled">Group</InputLabel>
                      <Select value={this.state.groups_user_id}
                        onChange={event => this.handleChangeGroup(event)}>
                        {this.state.groups.map(group => (
                          <MenuItem key={group.groups_user_id} value={group.groups_user_id} >
                            {group.groups_user_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      name="user_password"
                      label="Password"
                      type="password"
                      id="user_password"
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
                      name="user_confirm_password"
                      label="Confirm Password"
                      type="password"
                      onChange={this.confirmPassword}
                      error={this.state.error}
                      size='small'
                      required
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
    role: state.loginReducer.role,
    token: state.loginReducer.token
  };
}
const mapDispatchToProps = (dispatch) => ({
  login: (user_fullname, user_username, token, role) => dispatch(loginAction(user_fullname, user_username, token, role))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddUser);