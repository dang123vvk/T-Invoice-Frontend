import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/AccountCircleSharp';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { ThemeProvider } from '@material-ui/styles';
import { FormControl, Breadcrumbs, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableHead, TableRow, TableBody, Fab, TableCell, Tooltip } from '@material-ui/core';
import { Link } from "react-router-dom";
import { Redirect } from 'react-router'
import { connect } from "react-redux";
import NotFound from '../views/NotFound';
import { th } from "../share/config";
import EditIcon from '@material-ui/icons/Edit';
import _ from 'lodash';
import Draggable from 'react-draggable';
import { status } from './status';
import {getCustomerEdit, postCustomerEdit, updatePOCustomer, addPOCustomer } from '../share/services/customer.service';


function PaperComponent(props) {
  return (
    <Draggable cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

class EditCustomer extends Component {
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
      customer_details_id: 1,
      user_id: 1,
      redirect: false,
      message: '',
      data: [],
      dataSave: [],
      isDialog: false,
      dialogTitle: 'Add PO No',
      po_number_no: '',
      po_number_description: '',
      status_po_name: 'New',
      status_po_id: 1,
      isAdd: true,
      po_id: '',
      po_number_id: 1,
    }
    this.onChange = this.onChange.bind(this);
    this.clear = this.clear.bind(this);
    document.title = 'Edit Customer';
    this.openAdd = this.openAdd.bind(this);
    this.addPoNo = this.addPoNo.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
  }
  UNSAFE_componentWillMount () {
    getCustomerEdit(this.props.match.params.id, this.props.token).then(data => {
     this.setState({
      customer_name: data.customers.customer_name,
      customer_email: data.customers.customer_email,
      customer_address: data.customers.customer_address,
      customer_number_phone: data.customers.customer_number_phone,
      customer_details_id: data.customers.customer_details_id,
      customer_details_company: data.customerDetail.customer_details_company,
      customer_details_project: data.customerDetail.customer_details_project,
      customer_details_country: data.customerDetail.customer_details_country,
      customer_details_note: data.customerDetail.customer_details_note,
      customer_swift_code: data.customers.customer_swift_code,
      data: data.po_nos
     })
    })
  }
  handleSubmitForm(event) {
    event.preventDefault();
    const customer = {
      customer_details_company: this.state.customer_details_company,
      customer_details_project: this.state.customer_details_project,
      customer_details_country: this.state.customer_details_country,
      customer_details_id: this.state.customer_details_id,
      customer_details_note: this.state.customer_details_note,
      customer_name: this.state.customer_name,
      customer_email: this.state.customer_email,
      customer_address: this.state.customer_address,
      customer_number_phone: this.state.customer_number_phone,
      customer_swift_code: this.state.customer_swift_code,
      po_nos: this.state.data,

    };
    postCustomerEdit(this.props.match.params.id, customer, this.props.token).then(data=> {
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
    redirect: true
  })

  }
  openEdit(e, po_number_no,po_number_id) {
    e.preventDefault();
    var index = _.findIndex(this.state.data, function (ac) { return ac.po_number_no === po_number_no; });
    var temp = this.state.data;
    this.setState({
      isDialog: true,
      po_number_no: temp[index].po_number_no,
      po_number_description: temp[index].po_number_description,
      status_po_id: temp[index].status_po_id,
      dialogTitle: 'Edit PO No',
      isAdd: false,
      po_id: po_number_no,
      po_number_id: po_number_id
    })
  }
  openAdd(e) {
    e.preventDefault();
    this.setState({
      isDialog: true,
      po_number_no: '',
      po_number_description: '',
      status_po_id: 1,
      dialogTitle: 'Add PO No',
      isAdd: true
    })
  }
  addPoNo(e) {
    e.preventDefault();
    if (this.state.isAdd) {
      var status1 = status(this.state.status_po_id.toString());
      const Po = {
        po_number_description: this.state.po_number_description,
        status_po_id: this.state.status_po_id,
        po_number_no: this.state.po_number_no,
        status_po_name: status1
      };
      const PoSave = {
        po_number_no: this.state.po_number_no,
        status_po_id: this.state.status_po_id,
        customer_id: this.props.match.params.id,
        po_number_description: this.state.po_number_description,
      };
      this.setState(state => {
        const list = state.data.push(Po);
        return {
          list,
          isDialog: false,
          po_number_no: '',
          po_number_description: '',
          status_po_id: 1,
          dialogTitle: 'Add PO No',
        };
      });
      addPOCustomer(this.props.match.params.id,PoSave,this.props.token).then(data => {
      });
    }
    else {
      var status2 = status(this.state.status_po_id.toString());
      const Po = {
        po_number_description: this.state.po_number_description,
        status_po_id: this.state.status_po_id,
        po_number_no: this.state.po_number_no,
        status_po_name: status2
      };
      const PoSave = {
        po_number_no: this.state.po_number_no,
        status_po_id: this.state.status_po_id,
        po_number_description: this.state.po_number_description,
      };
      let index = _.findIndex(this.state.data, po => { return po.po_number_no === this.state.po_id; });
      const data = this.state.data;
      data[index] = Po;
      this.setState({
        isDialog: false,
        isAdd: true,
        data: data,
      });
      updatePOCustomer(this.state.po_number_id,PoSave,this.props.token).then(data => {
      })
    }

  }
  closeDialog(e) {
    e.preventDefault();
    this.setState({
      isDialog: false,
      isAdd: true
    })
  }
  render() {
    const redirect = this.state.redirect;
    if (redirect) {
      return <Redirect to='/customers' />;
    }
    if ((this.props.role === 'Director') && (localStorage.getItem('user_information'))) {
      return (
        <ThemeProvider theme={th}>
          <Container component="main" >
            <CssBaseline />

            <div style={{ marginTop: '20px', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
              <Paper elevation={0}   >
                <Breadcrumbs aria-label="Breadcrumb" separator="/">
                  <Link style={{ color: '#3f51b5' }} to="/" >
                    Home
          </Link>
                  <Link style={{ color: '#3f51b5' }} to="/customers" >
                    Customers
          </Link>
                  <Typography color="textPrimary">Add customer</Typography>
                </Breadcrumbs>
              </Paper>
              <Avatar style={{ marginTop: '1%',backgroundColor: '#3f51b5', }} >
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5" style={{ marginTop: '1%', marginBottom: '3%' }}>
                Edit customer
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
                    <Typography align="left" style={{ fontWeight: 'bold' }}>
                      PO Nos
                  </Typography>
                    <Typography align="right" style={{ fontWeight: 'bold' }}>
                      <Button variant="contained" color="primary" className="btn-without-border" onClick={this.openAdd} >
                        Add PO No
                                    </Button>
                    </Typography>
                    <Table style={{ width: '100%' }}>
                      <TableHead>
                        <TableRow>
                          <TableCell align='center'></TableCell>
                          <TableCell align='center'>PO No</TableCell>
                          <TableCell align="center" >Description</TableCell>
                          <TableCell align="center">Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {this.state.data.map(row => (
                          <TableRow hover role="checkbox" key={row.po_number_no} tabIndex={-1} >
                            <TableCell align="center">
                              <Tooltip title="Edit" aria-label="add">
                                <Fab size="small" color="primary" onClick={e => this.openEdit(e, row.po_number_no,row.po_number_id)} className="btn-without-border">
                                  <EditIcon />
                                </Fab>
                              </Tooltip>
                            </TableCell>
                            <TableCell align='center'>{row.po_number_no}</TableCell>
                            <TableCell align='center' >{row.po_number_description}</TableCell>
                            <TableCell align='center' >{row.status_po_name}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                  </Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={8}>
                  </Grid>
                  <Grid item xs={2}></Grid>
                  <Grid item xs={4}></Grid>
                  <Grid item xs={2}>
                    <Button style={{ marginTop: '2%', color: 'white', backgroundColor: 'red' }}
                      type="button"
                      fullWidth
                      variant="contained"
                      onClick={this.clear}
                      className="btn-without-border"
                    >
                      Cancel
          </Button>
                  </Grid>
                  <Grid item xs={2}>
                    <Button style={{ marginTop: '2%' }}
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary">
                      Save
          </Button>
                  </Grid>
                  <Grid item xs={4}></Grid>
                </Grid>
              </form>
              <Dialog PaperComponent={PaperComponent} open={this.state.isDialog} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{this.state.dialogTitle}</DialogTitle>
                <DialogContent >
                  <div id="configuration" className="container" ><br />
                    <div className="row d-flex align-items-center">
                      <div className="col-sm-5"> PO No</div>
                      <div className="col-sm-7">
                        <TextField
                          margin="dense"
                          variant="outlined"
                          value={this.state.po_number_no}
                          fullWidth
                          name="po_number_no"
                          type='number'
                          onChange={this.onChange}
                        />
                      </div>
                      <div className="col-sm-5">Description </div>
                      <div className="col-sm-7">
                        <TextField
                          margin="dense"
                          variant="outlined"
                          value={this.state.po_number_description}
                          fullWidth
                          name="po_number_description"
                          onChange={this.onChange}
                        />
                      </div>
                      <div className="col-sm-5">Status</div>
                      <div className="col-sm-7">
                        <select className="form-control"
                          value={this.state.status_po_id} name='status_po_id' onChange={this.onChange}
                        >
                          <option value={1}>New</option>
                          <option value={2}>Active</option>
                          <option value={3}>Used</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button variant="contained" className="btn-without-border" onClick={this.closeDialog} style={{ backgroundColor: 'red', color: 'white' }}>
                    Cancel
                                        </Button>
                  <Button color="primary" className="btn-without-border" variant="contained" onClick={this.addPoNo} >
                    Save
                                        </Button>
                </DialogActions>
              </Dialog>
            </div>
          </Container>
        </ThemeProvider>
      );
    }
    return (
      <NotFound />
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user_fullname: state.loginReducer.user_fullname,
    role: state.loginReducer.role,
    token: state.loginReducer.token
  };
}
export default connect(mapStateToProps)(EditCustomer);