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
import { Button, TextField, Paper } from '@material-ui/core';
import Axios from 'axios';
import { Redirect } from 'react-router'
import {API} from '../share/api';
import { connect } from "react-redux";
import ErrorLogin from '../share/error.login';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { Link } from "react-router-dom";
import {month} from '../share/month';
const API_URL = API + 'templates/edit';

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

            templates_name_company :'',
            templates_address :'',
            templates_phone  :'',
            templates_email  :'',
            templates_name_on_account  :'',
            templates_tel :'',
            templates_fax  :'',
            templates_sign  :'',
            customer_id  : 0,
            templates_name_cfo  :'',
            templates_tel_cfo :'',
            templates_extension_cfo :'',
            templates_email_cfo :'',

            redirect: false,
            error: false,
            bill_no: 0,
            bill_reference:'',
            temp: 0,
            status: [],
            month_1: '',
            bill_content: 'Monthly cost for',
        }
        this.componentWillMount = this.componentDidMount.bind(this);
        this.cancel = this.cancel.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    componentDidMount() {
        var date = new Date().getDate(); 
        var month1 = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        if (month1 < 10) month1 = "0" + month1;
        if (date < 10) date = "0" + date;
        
        Axios.get(API_URL, { headers: { Authorization: localStorage.getItem('token') } })
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
            bill_id  : response.data.temp.bill_id,
            templates_name_cfo  :response.data.temp.templates_name_cfo,
            templates_tel_cfo :response.data.temp.templates_tel_cfo,
            templates_extension_cfo :response.data.temp.templates_extension_cfo,
            templates_email_cfo :response.data.temp.templates_email_cfo,
            });
        })
        .catch(err => console.log(err));
        
    }
    
    cancel(e)
    {
        this.setState({
            redirect: true
        })
    }
    editTemplate(event) {
        event.preventDefault();
        const template = this.state
        Axios.post(API_URL, template, { headers: { Authorization: localStorage.getItem('token') } })
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
            return <Redirect to='/detail-template' />;
        }
        if((this.props.isLogin) || (localStorage.getItem('user_name')))
        {
        return (
            <form style={{ width: '100%', marginTop: 1 }} validate onSubmit={event => this.editTemplate(event)}>
            <ThemeProvider theme={th}>
                <Container component="main" maxWidth="md" style={{ backgroundColor: 'white' }} >
                    <CssBaseline />
                      
                   
                        <main >
                            <div style={{ marginTop: '20px' }} >
                                <Grid container spacing={3}>
                                    <Grid item xs={3} style={{ height: 'auto' }} justify-xs-space-between="true"	>
                                        <img src={logotma} width="150px" alt="vvn" />
                                    </Grid>
                                    <Grid item xs={9} style={{ height: '100px' }} justify-xs-space-between="true"	>
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
                                            />
                                                </Typography>
                                        <Typography style={{ fontSize: '15px', fontWeight: 'bold' }} align='right'>Address: 
                                        <Input
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
                                        <Typography style={{ fontSize: '15px', fontWeight: 'bold' }} align='right'>Phone:  <Input
                                                style={{ width: '40%',fontSize:'13px'}}
                                                type="text"
                                                value={this.state.templates_phone}
                                                inputProps={{
                                                    'aria-label': 'Description',
                                                }}
                                                name="templates_phone"
                                                onChange={this.onChange}
                                                required
                                            /> - E-mail: <Input
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
                                            </Typography>
                                    </Grid>
                                    <Grid item xs={5} style={{ height: 'auto' }}>
                                        <Typography variant="h4" style={{ fontWeight: 'bold' }}>INVOICE</Typography>
                                    </Grid>
                                    <Grid item xs={7} style={{ height: 'auto' }} className="border border-primary">
                                        <div className="row">
                                            <div className="col-sm-8" style={{ fontWeight: 'bold' }}>TMA reference number:</div>
                                            <div className="col-sm-4" >
                                                
                                            </div>
                                        </div>
                                        <div className="row" style = {{ marginTop: '10px'}}>
                                            <div className="col-sm-8" style={{ fontWeight: 'bold' }}>PO No</div>
                                            <div className="col-sm-4" >
                                                
                                            </div>
                                        </div>
                                        <div className="row" style = {{ marginTop: '10px'}}>
                                            <div className="col-sm-8" style={{ fontWeight: 'bold' }}>Date: </div>
                                            <div className="col-sm-4" > 
                                            </div>
                                        </div>
                                    </Grid>
                                    <Grid item xs={4} >
                                        <div className="row">
                                            <div className="col-sm-4" style={{ fontWeight: 'bold' }}>To:</div>
                                            <div className="col-sm-8" >
                                                ...
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-4" style={{ fontWeight: 'bold' }}></div>
                                            <div className="col-sm-8" style={{ marginTop:'10px'}}>
                                            ....
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-12" style={{ height: '10px' }}></div>
                                        </div>
                                        <div className="row">
                                            <div className="col-sm-4" style={{ fontWeight: 'bold' }}></div>
                                            <div className="col-sm-8" style={{ fontWeight: 'bold' }}>PO No: ....</div>
                                        </div>
                                    </Grid>
                                    <Grid item xs={8} >
                                    </Grid>
                                    <Grid item xs={12} >
                                        <div style={{ fontWeight: 'bold' }}>Description:</div>
                                    </Grid>
                                    <Grid item xs={6} align-content-xs-flex-end="true" >
                                        <Typography style={{ fontWeight: 'bold', fontSize: '20px' }} align="right">  Monthly cost for </Typography>
                                    </Grid>
                                    <Grid item xs={6} >
                                        <Typography style={{ fontWeight: 'bold', fontSize: '20px' }} align="left">
                                            Month
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} >
                                        
                                    </Grid>
                                    
                                    <Grid item xs={12} >
                                        <Typography style={{ fontSize: '15px' }} align='left'>Please pay by <a style={{fontWeight: 'bold'}}>WIRE TRANSFER</a> the above amount to our account:</Typography>
                                    </Grid>
                                    <Grid item xs={12} >
                                        <div className="row border border-primary" style={{ height: 'auto' }}>
                                            <div className="col-sm-4" style={{ fontWeight: 'bold', marginTop: '10px' }}>Name on account :</div>
                                            <div className="col-sm-8" style={{ fontWeight: 'bold', marginTop: '10px' }}><Input
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
                                               ....
                                            </div>
                                            <div className="col-sm-4" style={{ fontWeight: 'bold',marginTop: '10px' }}>Bank Name :</div>
                                            <div className="col-sm-8" style={{ marginTop: '10px' }}>....</div>
                                            <div className="col-sm-4" style={{ marginTop: '10px' }}></div>
                                            <div className="col-sm-8" style={{ marginTop: '10px' }} >....</div>
                                            <div className="col-sm-4" style={{ marginTop: '10px' }}></div>
                                            <div className="col-sm-8" style={{  marginTop: '10px' }}>(SWIFT code: ....)</div>
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
                                            /></div>
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
                                            /> , extension: 
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
                    
                </Container>
            </ThemeProvider>
            </form>
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
  export default connect(mapStateToProps) (AddBill);