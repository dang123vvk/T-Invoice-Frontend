import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/AccountCircleSharp';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import blue from '@material-ui/core/colors/blue';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { FormControl, Breadcrumbs, Paper } from '@material-ui/core';
import { Link } from "react-router-dom";
import axios from 'axios';
import { Redirect } from 'react-router'
import { connect } from "react-redux";
import ErrorLogin from '../share/error.login';
import MaterialTable from 'material-table';
import {API} from '../share/api';
const API_URL = API + 'customers/add';
const th = createMuiTheme({
  palette: {
    primary: { main: blue[500] },
    secondary: { main: '#2196f3' },
  },
});
class AddCustomer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customer_name: '',
      customer_email: '',
      customer_address: '',
      customer_number_phone: '',
      customer_details_company: '',
      customer_details_project: '',
      customer_details_country: '',
      customer_details_note: '',
      customer_swift_code: '',
      user_id: 1,
      redirect: false,
      message: '',
      columns: [
        { title: 'PO No', field: 'po_number_no', type: 'numeric' },
        { title: 'Description', field: 'po_number_description' },
        { title: 'Status', field: 'status_po_id', lookup: { 1: 'New', 2: 'Active', 3: 'Used' } },
      ],
      data: [
      ],
    }
    this.onChange = this.onChange.bind(this);
    this.clear = this.clear.bind(this);
  }
  handleSubmitForm(event) {
    event.preventDefault();
    const customer = {
      customer_details_company: this.state.customer_details_company,
      customer_details_project: this.state.customer_details_project,
      customer_details_country: this.state.customer_details_country,
      customer_details_note: this.state.customer_details_note,
      customer_name: this.state.customer_name,
      customer_email: this.state.customer_email,
      customer_address: this.state.customer_address,
      customer_number_phone: this.state.customer_number_phone,
      customer_swift_code: this.state.customer_swift_code,
      user_id: localStorage.getItem('user_id'),
      po_nos: this.state.data,

    };
    axios.post(API_URL, customer, { headers: { Authorization: localStorage.getItem('token') } })
      .then(response => {
        if (response.data.status == false) {
          this.setState({
            message: 'Customer already exists'
          })
        }
        else {
          this.setState({ redirect: true })
        }

      })
      .catch(err => console.log(err));
  }
  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
  clear(e) {
    this.setState({
      customer_name: '',
      customer_email: '',
      customer_address: '',
      customer_number_phone: '',
      customer_details_company: '',
      customer_details_project: '',
      customer_details_country: '',
      customer_details_note: '',
    });

  }
  render() {
    const redirect = this.state.redirect;
    if (redirect) {
      return <Redirect to='/customer-list' />;
    }
    if ((this.props.isLogin) || (localStorage.getItem('user_name'))) {
      return (
        <ThemeProvider theme={th}>
          <Container component="main" >
            <CssBaseline />

            <div style={{ marginTop: '20px', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
              <Paper elevation={0}   >
                <Breadcrumbs aria-label="Breadcrumb" separator="›">
                  <Link color="inherit" to="/" >
                    Home
          </Link>
                  <Link to="/customer-list" >
                    Customer
          </Link>
                  <Typography color="textPrimary">Add customer</Typography>
                </Breadcrumbs>
              </Paper>
              <Avatar style={{ marginTop: '10px', backgroundColor: '#2196f3', }} >
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5" style={{ marginTop: '10px', marginBottom: '30px' }}>
                Add an customer
        </Typography>
              <Typography style={{ color: 'red' }}>
                {this.state.message}
              </Typography>
              <form validate="true" onSubmit={event => this.handleSubmitForm(event)}>
                <Grid container spacing={1}>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth={true}>
                      <TextField
                        autoComplete="fname"
                        name="customer_name"
                        required
                        margin="dense"
                        fullWidth
                        id="customer_name"
                        autoFocus
                        label="Name"
                        value={this.state.customer_name}
                        onChange={this.onChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={4} >
                    <FormControl fullWidth={true}>
                      <TextField
                        required
                        fullWidth
                        id="customer_email"
                        label="Email"
                        margin="dense"
                        name="customer_email"
                        autoComplete="email"
                        type="email"
                        value={this.state.customer_email}
                        onChange={this.onChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={4} >
                    <FormControl fullWidth={true}>
                      <TextField
                        required
                        fullWidth
                        id="customer_address"
                        label="Address"
                        margin="dense"
                        name="customer_address"
                        value={this.state.customer_address}
                        onChange={this.onChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth={true}>
                      <TextField
                        required
                        fullWidth
                        margin="dense"
                        id="customer_number_phone"
                        label="Phone Number"
                        name="customer_number_phone"
                        value={this.state.customer_number_phone}
                        onChange={this.onChange}
                        type="number"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={4} >
                    <FormControl fullWidth={true}>
                      <TextField
                        required
                        fullWidth
                        id="customer_address"
                        label="Swift Code"
                        margin="dense"
                        name="customer_swift_code"
                        value={this.state.customer_swift_code}
                        onChange={this.onChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                  <FormControl fullWidth={true}>
                      <TextField
                        required
                        fullWidth
                        margin="dense"
                        id="customer_details_company"
                        label="Company"
                        name="customer_details_company"
                        value={this.state.customer_details_company}
                        onChange={this.onChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={4}>
                  <FormControl fullWidth={true}>
                      <TextField
                        required
                        fullWidth
                        margin="dense"
                        id="customer_details_project"
                        label="Project"
                        name="customer_details_project"
                        value={this.state.customer_details_project}
                        onChange={this.onChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                  <FormControl fullWidth={true}>
                      <TextField
                        required
                        fullWidth
                        margin="dense"
                        id="customer_details_country"
                        label="Country"
                        name="customer_details_country"
                        value={this.state.customer_details_country}
                        onChange={this.onChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={8}>
                  <FormControl fullWidth={true}>
                      <TextField
                        fullWidth
                        margin="dense"
                        id="customer_details_note"
                        label="Note"
                        name="customer_details_note"
                        value={this.state.customer_details_note}
                        onChange={this.onChange}
                        multiline
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={8}>
                  <Typography align="left" style={{fontWeight: 'bold'}}>
                                   PO Nos
                                </Typography>

                  </Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={8}>
                    <MaterialTable
                      title=" "
                      columns={this.state.columns}
                      data={this.state.data}
                      editable={{
                        onRowAdd: newData =>
                          new Promise((resolve, reject) => {
                            setTimeout(() => {
                              {
                                const data = this.state.data;
                                data.push(newData);
                                this.setState({ data }, () => resolve());
                              }
                              resolve()
                            }, 1000)
                          }),
                        onRowUpdate: (newData, oldData) =>
                          new Promise((resolve, reject) => {
                            setTimeout(() => {
                              {
                                const data = this.state.data;
                                const index = data.indexOf(oldData);
                                data[index] = newData;
                                this.setState({ data }, () => resolve());
                              }
                              resolve()
                            }, 1000)
                          }),
                        onRowDelete: oldData =>
                          new Promise((resolve, reject) => {
                            setTimeout(() => {
                              {
                                let data = this.state.data;
                                const index = data.indexOf(oldData);
                                data.splice(index, 1);
                                this.setState({ data }, () => resolve());
                              }
                              resolve()
                            }, 1000)
                          }),
                      }}
                      options={{
                        search: false,
                        paging: false
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={4}></Grid>
                  <Grid item xs={2}>
                    <Button style={{ marginTop: '20px', color: 'white', backgroundColor: 'red' }}
                      type="button"
                      fullWidth
                      variant="contained"
                      onClick={this.clear}
                    >
                      Clear
          </Button>
                  </Grid>
                  <Grid item xs={2}>
                    <Button style={{ marginTop: '20px' }}
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="secondary"
                    >
                      Save
          </Button>
                  </Grid>
                  <Grid item xs={4}></Grid>
                </Grid>
              </form>
            </div>
          </Container>
        </ThemeProvider>
      );
    }
    return (
      <ErrorLogin />
    );
  }
}
const mapStateToProps = state => {
  return {
    title: state.loginReducer.username,
    isLogin: state.loginReducer.isLogin
  };
}
export default connect(mapStateToProps)(AddCustomer);