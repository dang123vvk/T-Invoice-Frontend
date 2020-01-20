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
import NotFound from '../views/NotFound'
import { th } from "../share/config";
import { Breadcrumbs, Grid } from '@material-ui/core';
import {Link} from "react-router-dom";
import { postGroupAdd } from "../share/services/group.service";
class AddGroup extends Component {
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
    this.addGroup = this.addGroup.bind(this);
    this.onChange = this.onChange.bind(this);
    document.title = 'Add Group';
    this.clear = this.clear.bind(this);
  }
  
  addGroup(event) {
    event.preventDefault();
    const group = {
        groups_user_description: this.state.groups_user_description,
        groups_user_name: this.state.groups_user_name,
    };
    postGroupAdd(group,this.props.role,this.props.token).then(data => {
      this.setState({
        message: data.message
      })
    })

  }
  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
  clear(e) {
    this.setState({
      groups_user_name: '',
      groups_user_description: '',
    })
  }
  render() {
    const redirect = this.state.redirect;
    if (redirect) {
      return <Redirect to='/admin/groups' />;
    }
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
                  <Typography color="textPrimary">Add</Typography>
                </Breadcrumbs>
          <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
            <Avatar style={{ margin: 1, backgroundColor: '#3f51b5' }}>
              <LockOutlinedIcon  />
            </Avatar>
            <Typography component="h1" variant="h5">
              Add Group
        </Typography>
            <Typography style={{ color: 'red' }}>
              {this.state.message}
            </Typography>
            <div>
            <form style={{ width: '100%', marginTop: 1 }} validate="true" onSubmit={event => this.addGroup(event)}>
            <Grid container spacing={1}>
                  <Grid item xs={12}><TextField
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
              </Grid>
              <Grid item xs={12}>
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
              </Grid>
              <Grid item xs={2}></Grid>
                  <Grid item xs={4}>
                    <Button style={{ marginTop: '2%', color: 'white', backgroundColor: 'red' }}
                      type="button"
                      fullWidth
                      variant="contained"
                      color="secondary"
                      onClick={this.clear}
                    >
                      Clear
          </Button>
                  </Grid>
                  <Grid item xs={4}>
                    <Button style={{ marginTop: '2%' }}
                      type="submit"
                      fullWidth
                      variant="contained"
                      color='primary'
                    >
                      Save
          </Button>
                  </Grid>
                  <Grid item xs={2}></Grid>
          </Grid>
            </form>
            </div>
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

export default connect(mapStateToProps)(AddGroup);