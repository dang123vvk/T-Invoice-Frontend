import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { ThemeProvider } from '@material-ui/styles';
import Axios from 'axios';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';
import NotFound from '../views/NotFound'
import { th } from "../share/config";
import { getGroupEdit } from "../share/services/group.service";
import { Link } from "react-router-dom";
import { Breadcrumbs } from '@material-ui/core';
class EditGroup extends Component {
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
    document.title = 'Edit Group';
  }
  componentDidMount() {
 getGroupEdit(this.props.match.params.id, this.props.role, this.props.token).then(data =>{
   this.setState({
    groups_user_description: data.group.groups_user_description,
    groups_user_name: data.group.groups_user_name,
   })

   
 })
}
  editUser(event) {
    event.preventDefault();
    const user = {
        groups_user_description: this.state.groups_user_description,
        groups_user_name: this.state.groups_user_name,
        groups_user_id: this.props.match.params.id,
      
    };

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
    if((this.props.role === 'Admin') && (localStorage.getItem('user_information'))) {
      return (
        <ThemeProvider theme={th}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Breadcrumbs aria-label="Breadcrumb" separator="/" style={{ marginTop: '5%'}}>
                  <Link style={{ color: '#3f51b5' }} to="/" >
                    Home
          </Link>
                  <Link style={{ color: '#3f51b5' }} to="/admin/groups" >
                    Groups
          </Link>
                  <Typography color="textPrimary">Edit</Typography>
                </Breadcrumbs>
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
            <Avatar style={{ backgroundColor: '#3f51b5', margin: 1 }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Edit Group
        </Typography>
            <Typography style={{ color: 'red' }}>
              {this.state.message}
            </Typography>
            <form style={{ width: '100%', marginTop: 1 }} validate="true" onSubmit={event => this.editUser(event)}>
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
                color="primary"
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
export default connect(mapStateToProps)(EditGroup);