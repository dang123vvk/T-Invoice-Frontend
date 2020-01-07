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
import { Button, TextField, Paper } from '@material-ui/core';
import Axios from 'axios';
import { Redirect } from 'react-router'
import { connect } from "react-redux";
import NotFound from '../views/NotFound';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { Link } from "react-router-dom";
import {month} from '../share/month';
import {getTemplate} from '../share/services/template.service';
import {getAccountBankCurrent} from '../share/services/accountbank.service';
import {getCustomerUserCurrent, getCustomerPO} from '../share/services/customer.service';
import {getStatusBill} from '../share/services/bill.service';
const th = createMuiTheme({
    palette: {
        primary: { main: blue[500] }, 
        secondary: { main: '#2196f3' }, 
    },
});
class AddBill extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { title: 'Description', field: 'bill_item_description'},
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
                />) },
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
            user_id: localStorage.getItem('user_id'),
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
            error: false,
            bill_no: 0,
            bill_reference:'',
            temp: 0,
            status: [],
            month_1: '',
            bill_content: 'Monthly cost for',
            po_nos:[],
            bill_display_po: '',
            swiftcode: '',
            display_po: false,
        }
        this.componentWillMount = this.componentDidMount.bind(this);
        this.cancel = this.cancel.bind(this);
        this.onChange = this.onChange.bind(this);
        this.default = this.default.bind(this);
        this.customerdefault = this.customerdefault.bind(this);
        document.title = 'Add Bill';
    }
    componentDidMount() {
        var date = new Date().getDate(); 
        var month1 = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        if (month1 < 10) month1 = "0" + month1;
        if (date < 10) date = "0" + date;
        this.setState({
            bill_date: year + '-' + month1 + '-' + date,
            bill_monthly_cost: year + '-' + month1,
            month_1: month(month1)+year,
        });

        //template
       getTemplate().then(data => {
        this.setState({
            templates_name_company :data.temp.templates_name_company,
            templates_address : data.temp.templates_address,
            templates_phone  :data.temp.templates_phone,
            templates_email  :data.temp.templates_email,
            templates_name_on_account  :data.temp.templates_name_on_account,
            templates_tel :data.temp.templates_tel,
            templates_fax  :data.temp.templates_fax,
            templates_sign  :data.temp.templates_sign,
            templates_name_cfo  :data.temp.templates_name_cfo,
            templates_tel_cfo :data.temp.templates_tel_cfo,
            templates_extension_cfo :data.temp.templates_extension_cfo,
            templates_email_cfo :data.temp.templates_email_cfo,
            });
       })
       getAccountBankCurrent().then(data => {
        this.setState({ 
            accountbanks: data.accountsbank,
            account_bank_id: data.accountsbank[0].account_bank_id,
            account_bank_name: data.accountsbank[0].account_bank_name,
            account_bank_address: data.accountsbank[0].account_bank_address,
            account_bank_swift: data.accountsbank[0].account_bank_swift, });
    })
        getCustomerUserCurrent().then(data => {
            if(data.length_po_nos_add > 0)
            {
                this.setState({ 
                    customers: data.customers,
                    customer_id: data.customers[0].customer_id,
                    swiftcode: data.customers[0].customer_swift_code,
                    bill_reference: (this.state.month_1+data.customers[0].customer_swift_code).toUpperCase(),
                    customer_address: data.customers[0].customer_address,
                    bill_no: data.po_nos_add[0].po_number_id,
                    bill_display_po: data.po_nos_add[0].po_number_no,
                    po_nos: data.po_nos_add,
                    display_po: false,
                 });
            }
            else
            {
                this.setState({ 
                    customers: data.customers,
                    customer_id: data.customers[0].customer_id,
                    swiftcode: data.customers[0].customer_swift_code,
                    bill_reference: (this.state.month_1+data.customers[0].customer_swift_code).toUpperCase(),
                    customer_address: data.customers[0].customer_address,
                    display_po: true,
                 });
            }
        })
        getStatusBill().then(data => {
            this.setState({ 
                status: data.status
             });
        })
    //accountbank
 
    //customer
       //statusbll
        
    }
    //default template
    default(e){
    
    }
    //customtemplate
    customerdefault(e){
      
    }
    handleSubmitForm(event) {
        event.preventDefault();
        const bill = this.state;
        
    }
    handleChangeBillDate(event) {
        var value = event.target.value;

        this.setState({
            bill_date: value
        });
    } 
    handleChangeBillMonthlyCost(event) {
        var value = event.target.value;
        var month2 = value.slice(5,7);
        this.setState({
            bill_monthly_cost: value,
            month_1: month(month2)+value.slice(0,4),
            bill_reference: (month(month2)+value.slice(0,4)+this.state.swiftcode).toUpperCase(),
        });
    }
    handleChange(event) {
        this.setState({
            customer_id: event.target.value,
        });
        getCustomerPO(event.target.value).then(data => {
            if(data.length_po_nos_add > 0)
                {
                    this.setState({ 
                        bill_no: data.po_nos_add[0].po_number_id,
                        bill_display_po: data.po_nos_add[0].po_number_no,
                        po_nos: data.po_nos_add,
                        display_po: false,
                     });
                }
                else{
                    this.setState({ 
                       display_po: true,
                     });
                }
        })
        this.state.customers.map(customer => {
            if (customer.customer_id === event.target.value) {
                this.setState({
                    customer_address: customer.customer_address,
                    bill_reference: (this.state.month_1+customer.customer_swift_code).toUpperCase(),
                    swiftcode: customer.customer_swift_code,
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
    cancel(e)
    {
        this.setState({
            redirect: true
        })
    }
    onChange(e)
    {
      this.setState({
        [e.target.name]: e.target.value,
      });
    }
    render() {
        this.state.bills_sum = this.state.data.reduce((total, item) => total + parseInt(item.bill_item_cost, 10), 0);
        const redirect = this.state.redirect;
        if (redirect) {
            return <Redirect to='/bill-list' />;
        }
        if ((this.props.role) || (localStorage.getItem('user_information'))) {
        return (
            <ThemeProvider theme={th}>
                <Container component="main" maxWidth="md" style={{ backgroundColor: 'white' }} >
                    <CssBaseline />
                    <form validate="true" onSubmit={event => this.handleSubmitForm(event)}>
                        <main >
                            <div style={{ marginTop: '20px' }} >
                            <Grid container spacing={3} >
                            <Grid item xs={6} >
                                    </Grid>
                                    <Grid item xs={3} >
                                        <Typography style={{ fontSize: '10px', fontWeight: 'bold' }} align='center'>
                                            <Button style ={{  color: 'white'}} fullWidth type="button" size="small" color="primary" variant="contained" onClick={this.customerdefault} >Customer Template</Button>
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
                                    <Grid item xs={9} style={{ height: '100px' }} justify-xs-space-between="true"	>
                                        <Typography style={{ fontSize: '15px', fontWeight: 'bold' }} align='right'>&nbsp;&nbsp;</Typography>
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
                                            />
                                        <b>Address:</b><Input
                                                style={{ width: '90%',fontSize:'13px'}}
                                                type="text"
                                                value={this.state.templates_address}
                                                inputProps={{
                                                    'aria-label': 'Description',
                                                }}
                                                name="templates_address"
                                                onChange={this.onChange}
                                                required
                                            />
                                        <b>Phone:</b> <Input
                                                style={{ width: '40%',fontSize:'13px'}}
                                                type="text"
                                                value={this.state.templates_phone}
                                                inputProps={{
                                                    'aria-label': 'Description',
                                                }}
                                                name="templates_phone"
                                                onChange={this.onChange}
                                                required
                                            /> <b>- E-mail:</b>   <Input
                                                style={{ width: '41%',fontSize:'13px'}}
                                                type="text"
                                                value={this.state.templates_email}
                                                inputProps={{
                                                    'aria-label': 'Description',
                                                }}
                                                name="templates_email"
                                                onChange={this.onChange}
                                                required
                                            />
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
                                        <div className="row" style = {{ marginTop: '10px'}}>
                                            <div className="col-sm-8" style={{ fontWeight: 'bold' }}>PO No</div>
                                            <div className="col-sm-4" hidden={this.state.display_po} >
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
                                            <div className="col-sm-4" hidden={!(this.state.display_po)}>
                                            There isn't an active PO. Please add in <Link to={'/customer-edit/'+this.state.customer_id}>this customer</Link>
                                            </div>
                                        </div>
                                        <div className="row" style = {{ marginTop: '10px'}}>
                                            <div className="col-sm-8" style={{ fontWeight: 'bold' }}>Date: </div>
                                            <div className="col-sm-4" > 
                                            <Input
                                                style={{ width: '150px'}}
                                                type="date"
                                                value={this.state.bill_date}
                                                inputProps={{
                                                    'aria-label': 'Description',
                                                }}
                                                name="bill_date"
                                                onChange={this.onChange}
                                            /></div>
                                        </div>
                                    </Grid>
                                    <Grid item xs={4} >
                                        <div className="row">
                                            <div className="col-sm-4" style={{ fontWeight: 'bold' }}>To:</div>
                                            <div className="col-sm-8" >
                                            
                                                    <Select
                                                        value={this.state.customer_id}
                                                        onChange={event => this.handleChange(event)}
                                                    >
                                                     {this.state.customers.map(customer => (
                                                            <MenuItem key={customer.customer_swift_code} value={customer.customer_id} >
                                                                {customer.customer_name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                              
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-4" style={{ fontWeight: 'bold' }}></div>
                                            <div className="col-sm-8" style={{ marginTop:'10px'}}>
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
                                    <Grid item xs={6}  container justify="flex-end" alignItems="flex-end" >
                                         <Input
                                                    value={this.state.bill_content}
                                                    inputProps={{
                                                        'aria-label': 'Description',
                                                    }}
                                                    name="bill_content"
                                                    onChange={this.onChange}
                                                />
                                    </Grid>
                                    <Grid item xs={6}  >
                                            <Input
                                                type="month"
                                                defaultValue={this.state.bill_monthly_cost}
                                                onChange={event => this.handleChangeBillMonthlyCost(event)}
                                                inputProps={{
                                                    'aria-label': 'Description',
                                                }} />
                                    </Grid>
                                    <Grid item xs={12} >
                                    
                                    </Grid>
                                    <Grid item xs={12}>
                                        <div className="row">
                                            <div className="col-sm-8"></div>
                                            <div className="col-sm-4" style={{ fontWeight: 'bold', fontSize: '15px' }}>Total amount to be paid: ${this.state.bills_sum}</div>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} >
                                        <Typography style={{ fontSize: '15px' }} align='left'>Please pay by <a style={{fontWeight: 'bold'}}>WIRE TRANSFER</a> the above amount to our account:</Typography>
                                    </Grid>
                                    <Grid item xs={12} >
                                        <div className="row border border-primary" style={{ height: 'auto' }}>
                                            <div className="col-sm-4" style={{ fontWeight: 'bold', marginTop: '10px' }}>
                                            Name on account :
                                            </div>
                                            <div className="col-sm-8" style={{ fontWeight: 'bold', marginTop: '10px' }}> <Input
                                                style={{ width: '50%',fontSize:'13px'}}
                                                type="text"
                                                value={this.state.templates_name_on_account}
                                                inputProps={{
                                                    'aria-label': 'Description',
                                                }}
                                                name="templates_name_on_account"
                                                onChange={this.onChange}
                                                required
                                            /></div>
                                            <div className="col-sm-4" style={{ fontWeight: 'bold',marginTop: '10px' }}>Account number  :</div>
                                            <div className="col-sm-8" style={{ fontWeight: 'bold', marginTop: '10px' }}>
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
                                            <div className="col-sm-8" style={{ fontWeight: 'bold', marginTop: '10px' }}>
                                            <Input
                                                style={{ width: '50%',fontSize:'13px'}}
                                                type="text"
                                                value={this.state.templates_tel}
                                                inputProps={{
                                                    'aria-label': 'Description',
                                                }}
                                                name="templates_tel"
                                                onChange={this.onChange}
                                                required
                                            />
                                            </div>
                                            <div className="col-sm-4" style={{ fontWeight: 'bold', marginTop: '10px' }}>Fax:</div>
                                            <div className="col-sm-8" style={{ fontWeight: 'bold' , marginTop: '10px', marginBottom: '10px'}}>
                                            <Input
                                                style={{ width: '50%',fontSize:'13px'}}
                                                type="text"
                                                value={this.state.templates_fax}
                                                inputProps={{
                                                    'aria-label': 'Description',
                                                }}
                                                name="templates_fax"
                                                onChange={this.onChange}
                                                required
                                            />
                                            </div>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} >
                                    <div className="row" style={{ height: 'auto' }}>
                                    <div className="col-sm-4" style={{ fontSize: '15px', fontWeight: 'bold', color: 'red' }}>Status</div>
                                    <div className="col-sm-8">
                                    <FormControl >
                                                    <Select fullWidth
                                                        value={1} disabled
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
                                            />
                                    </Grid>
                                    <Grid item xs={12} >
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
                                            />
                                        <Typography style={{ fontSize: '15px', fontWeight: 'bold' }} align='left'>CFO</Typography>
                                        <b> Tel: </b>
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
                                            /><b>, extension: </b>
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
                                            />
                                      <b>Email: &nbsp; &nbsp;</b>
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
                                            />
            
                                    </Grid>
                                    <Grid item xs={12} style={{ height: "50px" }}>
                                    </Grid>
                                    <Grid item xs={2} >
                                    </Grid>
                                    <Grid item xs={4} >
                                        <Typography style={{ fontSize: '15px', fontWeight: 'bold' }} align='center'>
                                            <Button style ={{  color: 'white', backgroundColor: 'red'}} fullWidth type="button" size="large" color="primary" variant="contained" onClick={this.cancel} >Cancel</Button>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={4} >
                                        <Typography style={{ fontSize: '15px', fontWeight: 'bold' }} align='center'>
                                            <Button fullWidth type="submit" size="large" color="primary" variant="contained" >Save</Button>
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
<NotFound />
    );
}
}
const mapStateToProps = (state) => {
    return {
        user_fullname: state.loginReducer.user_fullname,
        role: state.loginReducer.role
    };
}
  export default connect(mapStateToProps) (AddBill);