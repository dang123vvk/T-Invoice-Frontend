import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import blue from '@material-ui/core/colors/blue';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Axios from 'axios';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import { API } from '../share/api';
import ErrorAdmin from '../share/error.admin'
const API_URL = API + 'groups/edit/';
const th = createMuiTheme({
  palette: {
    primary: { main: blue[500] }, // Purple and green play nicely together.
    secondary: { main: '#2196f3' }, // This is just green.A700 as hex.
  },
});

class EditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groups_user_name: '',
      groups_user_description: '',
      
      redirect: false,
      tokenVN: '',
      isLoading: false,
      message: '',
    }
    //this.editUser = this.editUser.bind(this);
    this.onChange = this.onChange.bind(this);
    this.confirmPassword = this.confirmPassword.bind(this);
  }
  componentDidMount() {
    Axios.get(API_URL + this.props.match.params.id, { headers: { Authorization: localStorage.getItem('token') } })
        .then(response => {
            this.setState({
                groups_user_name: response.data.group.groups_user_name,
                groups_user_description: response.data.group.groups_user_description,
            });
        })
        .catch(err => console.log(err));

}
  editUser(event) {
    event.preventDefault();
    const user = {
        groups_user_description: this.state.groups_user_description,
        groups_user_name: this.state.groups_user_name,
        groups_user_id: this.props.match.params.id,
      
    };
    Axios.post(API_URL, user, { headers: { Authorization: localStorage.getItem('token') } })
      .then(response => {
        if (response.data.status == true) {
          this.setState({
            redirect: true
          })
        }
        else {
          this.setState({
            message: 'Group already exists',
          })
        }

      })
      .catch(err => console.log(err));
  }
  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
  confirmPassword(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
    if(e.target.value == this.state.user_password)
    {
      this.setState({
        message: '',
      })
    }
    else 
    {
      this.setState({
        message: 'Those passwords didn\'t match. Try again',
      })
    }
  }
  render() {
    const redirect = this.state.redirect;
    if (redirect) {
      return <Redirect to='/group-list' />;
    }
    if ((((this.props.isLogin)  &&  (localStorage.getItem('role_id')==1))) || ((localStorage.getItem('user_name')) &&  (localStorage.getItem('role_id')==1))) {
      return (
        <ThemeProvider theme={th}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
            <Avatar style={{ backgroundColor: '#2196f3', margin: 1 }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Edit Group
        </Typography>
            <Typography style={{ color: 'red' }}>
              {this.state.message}
            </Typography>
            <form style={{ width: '100%', marginTop: 1 }} validate onSubmit={event => this.editUser(event)}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="groups_user_name"
                label="Group Name"
                name="groups_user_name"
                type="text"
                value={this.state.groups_user_name}
                onChange={this.onChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="groups_user_description"
                label="Group Description"
                name="groups_user_description"
                type="text"
                value={this.state.groups_user_description}
                onChange={this.onChange}
              />
              

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                style={{ margin: '3,0,2' }}
              >
                Save
          </Button>
            </form>
          </div>

        </Container>
      </ThemeProvider>
      );
    }
    return (
   <ErrorAdmin />
    )
  }
}
const mapStateToProps = (state) => {
  return {
    title: state.loginReducer.username,
    isLogin: state.loginReducer.isLogin
  };
}
export default connect(mapStateToProps)(EditUser);