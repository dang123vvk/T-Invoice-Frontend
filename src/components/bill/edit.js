import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import blue from '@material-ui/core/colors/blue';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import logotma from './logotma.png';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import MaterialTable from 'material-table';
import ErrorLogin from '../share/error.login';
import { Button, TextField, Paper, Breadcrumbs, Icon, IconButton } from '@material-ui/core';
import { Link } from "react-router-dom";
import Axios from 'axios';
import { Redirect } from 'react-router'
import { connect } from "react-redux";
import {API} from '../share/api';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CloseIcon from '@material-ui/icons/Close';
import WarningIcon from '@material-ui/icons/Warning';
const API_URL_CUSTOMER = API + 'customers/';
const API_URL = API+ 'bills/edit/';
const API_URL_TEMPLATE = API + 'templates/edit';
const API_URL_TEMPLATE_L = API + 'templates/select/';
const API_URL_TEMPLATE_CUS = API + 'templates/selectcustomer/';
const th = createMuiTheme({
    palette: {
        primary: { main: blue[500] }, // Purple and green play nicely together.
        secondary: { main: '#2196f3' }, // This is just green.A700 as hex.
    },
});
class EditBill extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { title: 'Description', field: 'bill_item_description' },
                { title: 'Payment Amount in USD', field: 'bill_item_cost', type: 'numeric',editComponent: props => (
                    <TextField
                     margin="dense"
                     onkeydown="return ( event.ctrlKey || event.altKey 
                    || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) 
                    || (95<event.keyCode && event.keyCode<106)
                    || (event.keyCode==8) || (event.keyCode==9) 
                    || (event.keyCode>34 && event.keyCode<40) 
                    || (event.keyCode==46) )"
                      error={this.state.error}
                      value={props.value}
                      placeholder="Cost"
                      onChange={e =>{ if(e.target.value>=0) { this.setState({error: false,temp: e.target.value });props.onChange(e.target.value)} else {this.setState({error: true}); props.onChange(0) } }}
                />)  },
            ],
            data: [
            ],
            //template
            templates_name_company :'',
            templates_address :'',
            templates_phone  :'',
            templates_email  :'',
            templates_name_on_account  :'',
            templates_tel :'',
            templates_fax  :'',
            templates_sign  :'',
            //customer_id  : 0,
            templates_name_cfo  :'',
            templates_tel_cfo :'',
            templates_extension_cfo :'',
            templates_email_cfo :'',
            customer_id: 1,
            customer_name: '',
            user_id: 1,
            bill_date: '',
            status_bill_id: 1,
            account_bank_id: 1,
            templates_id: 1,
            bills_sum: 0,
            bill_monthly_cost: '',
            accountbanks: [],
            customers: [],
            customer_address: '',
            account_bank_name: '',
            account_bank_address: '',
            account_bank_swift: '',
            redirect: false,
            disabled: null,
            message: '',
            status: [],
            bill_no: '',
            bill_reference:'',
            bill_content: '',
            po_nos:[],
            bill_display_po: '',
            close: false,
            display_po:false,
        }
        this.componentWillMount = this.componentDidMount.bind(this);
        this.cancel = this.cancel.bind(this);
        this.onChange = this.onChange.bind(this);
        this.default = this.default.bind(this);
        this.thisbill = this.thisbill.bind(this);
        this.customerdefault = this.customerdefault.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }
    componentDidMount() {
        Axios.get(API_URL_TEMPLATE_L +this.props.match.params.id, { headers: { Authorization: localStorage.getItem('token') } })
        .then(response => {
            this.setState({
            templates_name_company :response.data.temp.templates_name_company,
            templates_address : response.data.temp.templates_address,
            templates_phone  :response.data.temp.templates_phone,
            templates_email  :response.data.temp.templates_email,
            templates_name_on_account  :response.data.temp.templates_name_on_account,
            templates_tel :response.data.temp.templates_tel,
            templates_fax  :response.data.temp.templates_fax,
            templates_sign  :response.data.temp.templates_sign,
            templates_name_cfo  :response.data.temp.templates_name_cfo,
            templates_tel_cfo :response.data.temp.templates_tel_cfo,
            templates_extension_cfo :response.data.temp.templates_extension_cfo,
            templates_email_cfo :response.data.temp.templates_email_cfo,
            });
        })
        .catch(err => console.log(err));
        Axios.get(API_URL_CUSTOMER+localStorage.getItem('user_id'),{ headers: { Authorization: localStorage.getItem('token') } })
            .then(response => {
                this.setState({ 
                    customers: response.data.customers
                 });
            })
            .catch(err => console.log(err));
            Axios.get(API_URL+this.props.match.params.id + '/' + localStorage.getItem('user_id'),{ headers: { Authorization: localStorage.getItem('token') } })
            .then(response => {
                if(response.data.status==true)
                {
                    if((response.data.length > 0) && (response.data.po_number.status_po_id == 2))
                    {
                        this.setState({ 
                            data: response.data.items,
                            accountbanks: response.data.accountsbank,
                            account_bank_id: response.data.bill.account_bank_id,
                            templates_id:response.data.bill.templates_id,
                            account_bank_name: response.data.bill.account_bank_name,
                            account_bank_address: response.data.bill.account_bank_address,
                            account_bank_swift: response.data.bill.account_bank_swift,
                            customer_id: response.data.bill.customer_id,
                            customer_name: response.data.bill.customer_name,
                            status_bill_id: response.data.bill.status_bill_id,
                            customer_address: response.data.bill.customer_address,
                            bill_monthly_cost: response.data.bill.bill_monthly_cost,
                            bill_date: response.data.bill.bill_date,
                            disabled: false,
                            bill_no: response.data.bill.po_number_id,
                            bill_reference:response.data.bill.bill_reference,
                            bill_content: response.data.bill.bill_content,
                            bill_display_po: response.data.po_number.po_number_no,
                            po_nos: response.data.po_nos_add,
                            display_po: false,
                         });
                    }
                    else
                    {
                        this.setState({ 
                            data: response.data.items,
                            accountbanks: response.data.accountsbank,
                            account_bank_id: response.data.bill.account_bank_id,
                            templates_id:response.data.bill.templates_id,
                            account_bank_name: response.data.bill.account_bank_name,
                            account_bank_address: response.data.bill.account_bank_address,
                            account_bank_swift: response.data.bill.account_bank_swift,
                            customer_id: response.data.bill.customer_id,
                            customer_name: response.data.bill.customer_name,
                            status_bill_id: response.data.bill.status_bill_id,
                            customer_address: response.data.bill.customer_address,
                            bill_monthly_cost: response.data.bill.bill_monthly_cost,
                            bill_date: response.data.bill.bill_date,
                            disabled: false,
                            bill_no: response.data.bill.po_number_id,
                            bill_reference:response.data.bill.bill_reference,
                            bill_content: response.data.bill.bill_content,
                            bill_display_po: response.data.po_number.po_number_no,
                            display_po: true,
                         });
                    }
                    
                }
                else{
                    this.setState({
                        disabled: true,
                        message: 'You do not have permission to edit',
                    })
                }   
            })
            .catch(err => console.log(err));
            Axios.get(API+ 'bills/status',{ headers: { Authorization: localStorage.getItem('token') } })
            .then(response => {
                this.setState({ 
                    status: response.data.status
                 });
            })
            .catch(err => console.log(err));
    }
    handleSubmitForm(event) {
        event.preventDefault();
        const bill = {
            customer_id: this.state.customer_id,
            user_id: localStorage.getItem('user_id'),
            templates_id: this.state.templates_id,
            bill_date: this.state.bill_date,
            account_bank_id: this.state.account_bank_id,
            bills_sum: this.state.bills_sum,
            bill_monthly_cost: this.state.bill_monthly_cost,
            status_bill_id: this.state.status_bill_id,
            bill_reference:this.state.bill_reference,
            po_number_id: this.state.bill_no,
            items: this.state.data,
            bill_content: this.state.bill_content,

            templates_name_company :this.state.templates_name_company,
            templates_address : this.state.templates_address,
            templates_phone  :this.state.templates_phone,
            templates_email  :this.state.templates_email,
            templates_name_on_account  :this.state.templates_name_on_account,
            templates_tel :this.state.templates_tel,
            templates_fax  :this.state.templates_fax,
            templates_sign  :this.state.templates_sign,
            templates_name_cfo  :this.state.templates_name_cfo,
            templates_tel_cfo :this.state.templates_tel_cfo,
            templates_extension_cfo :this.state.templates_extension_cfo,
            templates_email_cfo :this.state.templates_email_cfo,
        };
        Axios.post(API_URL+this.props.match.params.id, bill,{ headers: { Authorization: localStorage.getItem('token') } })
            .then(response => {
                this.setState({ redirect: true })
            })
            .catch(err => console.log(err));
    }
    handleChangeBillDate(event) {
        var value = event.target.value;

        this.setState({
            bill_date: value
        });
    }
    handleChangeBillMonthlyCost(event) {
        var value = event.target.value;

        this.setState({
            bill_monthly_cost: value
        });
    }
    handleChange(event) {
        event.preventDefault();
        this.setState({
            customer_id: event.target.value,
        });
        this.state.customers.map(customer => {
            if (customer.customer_id === event.target.value) {
                this.setState({
                    customer_address: customer.customer_address,
                })
            }
        })
    }
    handleChangeAccount(event) {
        this.setState({
            account_bank_id: event.target.value,
        });
        this.state.accountbanks.map(accountbank => {
            if (accountbank.account_bank_id === event.target.value) {
                this.setState({
                    account_bank_name: accountbank.account_bank_name,
                    account_bank_address: accountbank.account_bank_address,
                    account_bank_swift: accountbank.account_bank_swift,
                })
            }
        })
    }
    handleChangeStatus(event) {
        this.setState({
            status_bill_id: event.target.value,
        });
    }
    handleChangeBillNo(event) {
        this.setState({
            bill_no: event.target.value,
        });
        this.state.po_nos.map(po_no => {
            if (po_no.po_number_id === event.target.value) {
                this.setState({
                   bill_display_po: po_no.po_number_no
                })
            }
        })
    }
    default(e){
        Axios.get(API_URL_TEMPLATE, { headers: { Authorization: localStorage.getItem('token') } })
        .then(response => {
            this.setState({
            templates_name_company :response.data.temp.templates_name_company,
            templates_address : response.data.temp.templates_address,
            templates_phone  :response.data.temp.templates_phone,
            templates_email  :response.data.temp.templates_email,
            templates_name_on_account  :response.data.temp.templates_name_on_account,
            templates_tel :response.data.temp.templates_tel,
            templates_fax  :response.data.temp.templates_fax,
            templates_sign  :response.data.temp.templates_sign,
            
            templates_name_cfo  :response.data.temp.templates_name_cfo,
            templates_tel_cfo :response.data.temp.templates_tel_cfo,
            templates_extension_cfo :response.data.temp.templates_extension_cfo,
            templates_email_cfo :response.data.temp.templates_email_cfo,
            });
        })
        .catch(err => console.log(err));
    }

    customerdefault(e){
        Axios.get(API_URL_TEMPLATE_CUS +  this.state.customer_id, { headers: { Authorization: localStorage.getItem('token') } })
        .then(response => {
            this.setState({
            templates_name_company :response.data.temp.templates_name_company,
            templates_address : response.data.temp.templates_address,
            templates_phone  :response.data.temp.templates_phone,
            templates_email  :response.data.temp.templates_email,
            templates_name_on_account  :response.data.temp.templates_name_on_account,
            templates_tel :response.data.temp.templates_tel,
            templates_fax  :response.data.temp.templates_fax,
            templates_sign  :response.data.temp.templates_sign,
            templates_name_cfo  :response.data.temp.templates_name_cfo,
            templates_tel_cfo :response.data.temp.templates_tel_cfo,
            templates_extension_cfo :response.data.temp.templates_extension_cfo,
            templates_email_cfo :response.data.temp.templates_email_cfo,
            });
        })
        .catch(err => console.log(err));
    }

    thisbill(e){
        Axios.get(API_URL_TEMPLATE_L +this.props.match.params.id, { headers: { Authorization: localStorage.getItem('token') } })
        .then(response => {
            this.setState({
            templates_name_company :response.data.temp.templates_name_company,
            templates_address : response.data.temp.templates_address,
            templates_phone  :response.data.temp.templates_phone,
            templates_email  :response.data.temp.templates_email,
            templates_name_on_account  :response.data.temp.templates_name_on_account,
            templates_tel :response.data.temp.templates_tel,
            templates_fax  :response.data.temp.templates_fax,
            templates_sign  :response.data.temp.templates_sign,
            
            templates_name_cfo  :response.data.temp.templates_name_cfo,
            templates_tel_cfo :response.data.temp.templates_tel_cfo,
            templates_extension_cfo :response.data.temp.templates_extension_cfo,
            templates_email_cfo :response.data.temp.templates_email_cfo,
            });
        })
        .catch(err => console.log(err));
    }
    onChangePDF = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState((state) => {
          state[name] = value;
          return state;
        })
      }
      cancel(e)
      {
          this.setState({redirect: true});
      }
      onChange(e)
    {
      this.setState({
        [e.target.name]: e.target.value,
      });
    }
    handleClose(e)
    {
      this.setState({
       close: true
      });
    }
    render() {

        this.state.bills_sum = this.state.data.reduce((total, item) => total + parseInt(item.bill_item_cost, 10), 0);
        const redirect = this.state.redirect;
        if (redirect) {
            return <Redirect to='/bill-list' />;
        }
        if((this.props.isLogin) || (localStorage.getItem('user_name')))
        {
        return (
            <ThemeProvider theme={th}>
                <Container component="main" maxWidth="md" style={{ backgroundColor: 'white' }} >
                    <CssBaseline />
                    <Grid container spacing={1}>
                    <Grid item xs={12}>
                    <Typography align="center" style={{ color: 'red', marginTop: '10px', fontWeight: 'bold' }}>
              {this.state.message}
            </Typography>
            </Grid>
            </Grid>
                    <Paper elevation={0} >
                        <Breadcrumbs aria-label="Breadcrumb" separator="›">
                            <Link color="inherit" to="/" >
                                Home
          </Link>
                            <Link to="/bill-list" >
                                Bills
          </Link>
                            <Typography color="textPrimary">Edit bill</Typography>
                        </Breadcrumbs>
                    </Paper>
                    <SnackbarContent
                    hidden={this.state.close}
     style={{ backgroundColor: '#ffa000'}}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" style={{ display: 'flex', alignItems: 'center'}}>
          <WarningIcon style={{fontSize: '20px'}} />
          &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;You should modify it as needed
        </span>}
        action={[
        <IconButton key="close" aria-label="Close" color="inherit"  onClick={this.handleClose} >
          <CloseIcon style={{fontSize:'20px'}} />
        </IconButton>,
      ]}
        />
                    <form validate="true" onSubmit={event => this.handleSubmitForm(event)}>
                        <main >
                            <div style={{ marginTop: '20px' }} >
                            <Grid container spacing={3} >
                            <Grid item xs={3} >
                                       
                                    </Grid>
                                    <Grid item xs={3} >
                                        <Typography style={{ fontSize: '10px', fontWeight: 'bold' }} align='center'>
                                            <Button style ={{  color: 'white'}} fullWidth type="button" size="small" color="primary" variant="contained" onClick={this.customerdefault} >Customer Template</Button>
                                        </Typography>
                                        </Grid>
                                    <Grid item xs={3} >
                                        <Typography style={{ fontSize: '10px', fontWeight: 'bold' }} align='center'>
                                            <Button style ={{  color: 'white'}} fullWidth type="button" size="small" color="primary" variant="contained" onClick={this.thisbill} >This Bill Template</Button>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3} >
                                        <Typography style={{ fontSize: '10px', fontWeight: 'bold' }} align='center'>
                                            <Button style ={{  color: 'white'}} fullWidth type="button" size="small" color="primary" variant="contained" onClick={this.default} >Default Template</Button>
                                        </Typography>
                                    </Grid>
                                    </Grid>
                                <Grid container spacing={3}>
                                    <Grid item xs={3} style={{ height: 'auto' }} justify-xs-space-between="true"	>
                                        <img src={logotma} width="150px" alt="vvn" />
                                    </Grid>
                                    <Grid item xs={9} style={{ height: 'auto' }} justify-xs-space-between="true"	>
                                        <Typography style={{ fontSize: '15px', fontWeight: 'bold' }} align='right'>&nbsp;&nbsp;</Typography>
                                        <Typography style={{ fontSize: '15px', fontWeight: 'bold' }} align='right'>
                                        <Input
                                                style={{ width: '100%',fontSize:'13px'}}
                                                type="text"
                                                value={this.state.templates_name_company}
                                                inputProps={{
                                                    'aria-label': 'Description',
                                                }}
                                                name="templates_name_company"
                                                onChange={this.onChange}
                                                required
                                            /></Typography>
                                        <Typography style={{ fontSize: '15px', fontWeight: 'bold' }} align='right'>Address:<Input
                                                style={{ width: '90%',fontSize:'13px'}}
                                                type="text"
                                                value={this.state.templates_address}
                                                inputProps={{
                                                    'aria-label': 'Description',
                                                }}
                                                name="templates_address"
                                                onChange={this.onChange}
                                                required
                                            /></Typography>
                                        <Typography style={{ fontSize: '15px', fontWeight: 'bold' }} align='right'>Phone: 
                                        <Input
                                                style={{ width: '40%',fontSize:'13px'}}
                                                type="text"
                                                value={this.state.templates_phone}
                                                inputProps={{
                                                    'aria-label': 'Description',
                                                }}
                                                name="templates_phone"
                                                onChange={this.onChange}
                                                required
                                            /> - E-mail: 
                                            <Input
                                                style={{ width: '41%',fontSize:'13px'}}
                                                type="text"
                                                value={this.state.templates_email}
                                                inputProps={{
                                                    'aria-label': 'Description',
                                                }}
                                                name="templates_email"
                                                onChange={this.onChange}
                                                required
                                            /></Typography>
                                    </Grid>
                                    <Grid item xs={5} style={{ height: 'auto' }}>
                                        <Typography variant="h4" style={{ fontWeight: 'bold' }}>INVOICE</Typography>
                                    </Grid>
                                    <Grid item xs={7} style={{ height: 'auto' }} className="border border-primary">
                                        <div className="row">
                                            <div className="col-sm-8" style={{ fontWeight: 'bold' }}>TMA reference number:</div>
                                            <div className="col-sm-4" >
                                                <Input
                                                    value={this.state.bill_reference}
                                                    inputProps={{
                                                        'aria-label': 'Description',
                                                    }}
                                                    name="bill_reference"
                                                    onChange={this.onChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-8" style={{ fontWeight: 'bold' }}>PO No</div>
                                            <div className="col-sm-4" hidden={this.state.display_po}>
                                            <FormControl >
                                                    <Select
                                                        value={this.state.bill_no}
                                                        onChange={event => this.handleChangeBillNo(event)}
                                                    >
                                                     {this.state.po_nos.map(po_no => (
                                                            <MenuItem key={po_no.po_number_id} value={po_no.po_number_id} >
                                                                {po_no.po_number_no}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </div>
                                            <div className="col-sm-4" style={{marginTop: '10px', marginBottom: '10px'}} hidden={!(this.state.display_po)}>
                                             {this.state.bill_display_po}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-8" style={{ fontWeight: 'bold' }}>Date: </div>
                                            <div className="col-sm-4" > <Input
                                             style={{ width: '150px'}}
                                                value={this.state.bill_date}
                                                inputProps={{
                                                    'aria-label': 'Description',
                                                }}
                                                onChange={this.onChange}
                                                name="bill_date"
                                                type="date"
                                            /></div>
                                        </div>
                                    </Grid>
                                    <Grid item xs={4} >
                                        <div className="row">
                                            <div className="col-sm-4" style={{ fontWeight: 'bold' }}>To:</div>
                                            <div className="col-sm-8" style={{marginTop:'10px'}}>
                                               {this.state.customer_name}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-4" style={{ fontWeight: 'bold' }}></div>
                                            <div className="col-sm-8" style={{marginTop:'10px'}} >
                                            {this.state.customer_address}
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-12" style={{ height: '10px' }}></div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-4" style={{ fontWeight: 'bold' }}></div>
                                            <div className="col-sm-8" style={{ fontWeight: 'bold' }}>PO No: {this.state.bill_display_po}</div>
                                        </div>
                                    </Grid>
                                    <Grid item xs={8} >
                                    </Grid>
                                    <Grid item xs={12} >
                                        <div style={{ fontWeight: 'bold' }}>Description:</div>
                                    </Grid>
                                    <Grid item xs={6} align-content-xs-flex-end="true" >
                                        <Typography style={{ fontWeight: 'bold', fontSize: '20px' }} align="right"><Input
                                                    value={this.state.bill_content}
                                                    inputProps={{
                                                        'aria-label': 'Description',
                                                    }}
                                                    name="bill_content"
                                                    onChange={this.onChange}
                                                /></Typography>
                                    </Grid>
                                    <Grid item xs={6} >
                                        <Typography style={{ fontWeight: 'bold', fontSize: '20px' }} align="left">
                                            <Input
                                                type="month"
                                                value={this.state.bill_monthly_cost}
                                                inputProps={{
                                                    'aria-label': 'Description',
                                                }} 
                                                onChange={this.onChange}
                                                name="bill_monthly_cost"
                                                />
                                                
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} >
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
                                                                newData.bill_item_cost= this.state.temp;
                                                                this.setState({temp: 0});
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
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <div className="row">
                                            <div className="col-sm-7" style={{ fontWeight: 'bold' }}></div>
                                            <div className="col-sm-5" style={{ fontWeight: 'bold', fontSize: '15px' }}>Total amount to be paid: ${this.state.bills_sum}</div>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} >
                                    <Typography style={{ fontSize: '15px' }} align='left'>Please pay by <a style={{fontWeight: 'bold'}}>WIRE TRANSFER</a> the above amount to our account:</Typography>
                                    </Grid>
                                    <Grid item xs={12} >
                                        <div className="row border border-primary" style={{ height: 'auto' }}>
                                            <div className="col-sm-4" style={{ fontWeight: 'bold',marginTop: '10px' }}>Name on account :</div>
                                            <div className="col-sm-8" style={{ fontWeight: 'bold',marginTop: '10px' }}>
                                            <Input
                                                style={{ width: '50%',fontSize:'13px'}}
                                                type="text"
                                                value={this.state.templates_name_on_account}
                                                inputProps={{
                                                    'aria-label': 'Description',
                                                }}
                                                name="templates_name_on_account"
                                                onChange={this.onChange}
                                                required
                                            />
                                            </div>
                                            <div className="col-sm-4" style={{ fontWeight: 'bold' ,marginTop: '10px'}}>Account number  :</div>
                                            <div className="col-sm-8" style={{ fontWeight: 'bold',marginTop: '10px' }}>
                                                <FormControl >
                                                    <Select
                                                        value={this.state.account_bank_id}
                                                        onChange={event => this.handleChangeAccount(event)}
                                                    >
                                                        {this.state.accountbanks.map(accountbank => (
                                                            <MenuItem key={accountbank.account_bank_id} value={accountbank.account_bank_id} >
                                                                {accountbank.account_bank_number}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </div>
                                           <div className="col-sm-4" style={{ fontWeight: 'bold',marginTop: '10px' }}>Bank Name :</div>
                                            <div className="col-sm-8" style={{ marginTop: '10px' }}>{this.state.account_bank_name}</div>
                                            <div className="col-sm-4" style={{ marginTop: '10px' }}></div>
                                            <div className="col-sm-8" style={{ marginTop: '10px' }} >{this.state.account_bank_address}</div>
                                            <div className="col-sm-4" style={{ marginTop: '10px' }}></div>
                                            <div className="col-sm-8" style={{  marginTop: '10px' }}>(SWIFT code: {this.state.account_bank_swift})</div>
                                            <div className="col-sm-4" style={{ fontWeight: 'bold', marginTop: '10px' }}>Tel:</div>
                                            <div className="col-sm-8" style={{ fontWeight: 'bold', marginTop: '10px' }}>+84-28 38292288</div>
                                            <div className="col-sm-4" style={{ fontWeight: 'bold', marginTop: '10px' }}>Fax:</div>
                                            <div className="col-sm-8" style={{ fontWeight: 'bold' , marginTop: '10px', marginBottom: '10px'}}>+84-28 38230530</div>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} >
                                    <div className="row" style={{ height: 'auto' }}>
                                    <div className="col-sm-4" style={{ fontSize: '15px', fontWeight: 'bold', color: 'red' }}>Status</div>
                                    <div className="col-sm-8">
                                    <FormControl >
                                                    <Select fullWidth
                                                        value={this.state.status_bill_id} 
                                                        onChange={event => this.handleChangeStatus(event)}
                                                    >
                                                           {this.state.status.map(status => (
                                                            <MenuItem key={status.status_bill_id} value={status.status_bill_id} >
                                                                {status.status_bill_name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                    </div> 
                                    </div>
                                    </Grid>
                                    <Grid item xs={12} >
                                        <Typography style={{ fontSize: '15px', fontWeight: 'bold' }} align='left'><br />
                                        <Input
                                                style={{ width: '40%',fontSize:'13px'}}
                                                type="text"
                                                value={this.state.templates_sign}
                                                inputProps={{
                                                    'aria-label': 'Description',
                                                }}
                                                name ="templates_sign"
                                                onChange={this.onChange}
                                                required
                                            /></Typography>
                                    </Grid>
                                    <Grid item xs={12} style={{ height: "50px" }}>
                                    </Grid>
                                    <Grid item xs={12} >
                                        <Typography style={{ fontSize: '15px', fontWeight: 'bold' }} align='left'>
                                        <Input
                                                style={{ width: '40%',fontSize:'13px'}}
                                                type="text"
                                                value={this.state.templates_name_cfo}
                                                inputProps={{
                                                    'aria-label': 'Description',
                                                }}
                                                name="templates_name_cfo"
                                                onChange={this.onChange}
                                                required
                                            /></Typography>
                                        <Typography style={{ fontSize: '15px', fontWeight: 'bold' }} align='left'>CFO</Typography>
                                        <Typography style={{ fontSize: '15px', fontWeight: 'bold' }} align='left'>Tel: 
                                        <Input
                                                style={{ width: '20%',fontSize:'13px'}}
                                                type="text"
                                                value={this.state.templates_tel_cfo}
                                                inputProps={{
                                                    'aria-label': 'Description',
                                                }}
                                                name="templates_tel_cfo"
                                                onChange={this.onChange}
                                                required
                                            />, extension: 
                                            <Input
                                                style={{ width: '20%',fontSize:'13px'}}
                                                type="text"
                                                value={this.state.templates_extension_cfo}
                                                inputProps={{
                                                    'aria-label': 'Description',
                                                }}
                                                name="templates_extension_cfo"
                                                onChange={this.onChange}
                                                required
                                            /></Typography>
                                        <Typography style={{ fontSize: '15px', fontWeight: 'bold' }} align='left'>Email: 
                                        <Input
                                                style={{ width: '20%',fontSize:'13px'}}
                                                type="text"
                                                value={this.state.templates_email_cfo}
                                                inputProps={{
                                                    'aria-label': 'Description',
                                                }}
                                                name="templates_email_cfo"
                                                onChange={this.onChange}
                                                required
                                            /></Typography>
                                    </Grid>
                                    <Grid item xs={12} style={{ height: "50px" }}>
                                    </Grid>
                                    <Grid item xs={2} >
                                    </Grid>
                                    <Grid item xs={4} >
                                        <Typography style={{ fontSize: '15px', fontWeight: 'bold' }} align='center'>
                                            <Button fullWidth disabled={this.state.disabled} type="button" size="large" color="primary" variant="contained" style={{color: 'white', backgroundColor: 'red'}} onClick={this.cancel} >Cancel</Button>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4} >
                                        <Typography style={{ fontSize: '15px', fontWeight: 'bold' }} align='center'>
                                            <Button fullWidth disabled={this.state.disabled} type="submit" size="large" color="primary" variant="contained" >Save</Button>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={2} >
                                    </Grid>
                                </Grid>
                            </div>
                        </main>
                    </form>
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
  export default connect(mapStateToProps) (EditBill);