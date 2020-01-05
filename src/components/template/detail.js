import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import blue from '@material-ui/core/colors/blue';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import logotma from './logotma.png';
import Axios from 'axios';
import { Redirect } from 'react-router'
import { connect } from "react-redux";
import Doc from './docService';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import PrintIcon from '@material-ui/icons/Print';
import EditIcon from '@material-ui/icons/Edit';
import PageTemplate from './pagetemlate';
import { PDFExport } from '@progress/kendo-react-pdf';
import { Link } from "react-router-dom";
import ErrorLogin from '../share/error.login';
import {month} from '../share/month';
import {API} from '../share/api';
import {
    ExcelExport,
    ExcelExportColumn,
    ExcelExportColumnGroup
} from '@progress/kendo-react-excel-export';
import { aggregateBy } from '@progress/kendo-data-query';
import { Tooltip, Paper, Breadcrumbs } from '@material-ui/core';
const API_URL = API + 'templates/edit';
const aggregates = [ { field: 'bill_item_cost', aggregate: 'SUM' } ];
const total= (props)=>(aggregateBy(props.data, aggregates));
const URL_EDIT="/bill-edit/";
const th = createMuiTheme({
    palette: {
        primary: { main: blue[500] }, // Purple and green play nicely together.
        secondary: { main: '#2196f3' }, // This is just green.A700 as hex.
    },
});
const StyledTableCell = withStyles(theme => ({
    head: {
        color: '#2196f3',
        fontWeight: 'bold'
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);
const StyledTableRow = withStyles(theme => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
}))(TableRow);
const CustomFooter = (props) =>
    (`Total `);
class DetailBill extends Component {
    pdfExportComponent;
    _exporter;
    export = () => {
        this._exporter.save();
    }
    constructor(props) {
        super(props);
        this.state = {

            templates_name_company :'',
            templates_address :'',
            templates_phone  :'',
            templates_email  :'',
            templates_name_on_account  :'',
            templates_tel :'',
            templates_fax  :'',
            templates_sign  :'',
            bill_id  : 1,
            templates_name_cfo  :'',
            templates_tel_cfo :'',
            templates_extension_cfo :'',
            templates_email_cfo :'',

            columns: [
                { title: 'Description', field: 'bill_item_description' },
                { title: 'Payment Amount in USD', field: 'bill_item_cost', type: 'numeric' },
            ],
            data: [
                { bill_item_description: 'Monthly off-shore labor cost for 10 resources in Vietnam – Aug 2017', bill_item_cost: 300 },
                { bill_item_description: 'Onshore cost from July 2017 – Aug 2017', bill_item_cost: 200 },
            ],
            customer_id: 1,
            customer_name: 'Customer Name',
            user_id: 1,
            bill_date: '2019-07-12',
            status_bill_id: 1,
            account_bank_id: 1,
            templates_id: 1,
            bills_sum: 0,
            bill_monthly_cost: '',
            accountbanks: [],
            customers: [],
            customer_address: 'Customer address',
            account_bank_name: 'Agribank',
            account_bank_number: '6380201008359',
            account_bank_address: ' Quận 10, Thành Phố Hồ Chí Minh',
            account_bank_swift: 'VBAAVNVX',
            redirect: false,
            bill_no: '1101043286',
            bill_reference:'AUG2017CUS',
        }
        this.componentWillMount = this.componentDidMount.bind(this);
    }
    componentDidMount() {
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
    onChangePDF = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState((state) => {
            state[name] = value;
            return state;
        })
    }
    createPdf = (html) => Doc.createPdf(html);
    render() {
        this.state.data.map((data,index) => {

            var k=Number(data.bill_item_cost);   
            data.cost=k.toLocaleString('vi');
        
     });
        this.state.data.map((key,index)=>{
            key.in = index +1;
        });
        this.state.bills_sum = this.state.data.reduce((total, item) => total + parseInt(item.bill_item_cost, 10), 0);
        const redirect = this.state.redirect;
        const m = month(this.state.bill_monthly_cost.slice(5,7));
        const sumCost = (props) =>(`${this.state.bills_sum}`);
        if (redirect) {
            return <Redirect to='/bill-list' />;
        }
        if ((this.props.isLogin) || (localStorage.getItem('user_name'))) {
            return (
                <div >
                    <div className="example-config">
                        <ThemeProvider theme={th}>
                            <Container component="main" maxWidth="sm" >
                                <Grid container spacing={3} >
                                <Grid item xs={12} >
                                <Paper elevation={0}   >
                                    <Breadcrumbs aria-label="Breadcrumb" separator="›">
                                    <Link color="inherit" to="/" >
                                        Home
                                    </Link>
                                    <Link to="/dashboard" >
                                        Dashboard
                                    </Link>
                                    <Typography color="textPrimary">Detail Template</Typography>
                                    </Breadcrumbs>
                                </Paper>
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                </Grid>
                                    <Grid item xs={12} sm={4}  align="right">
                                    <Tooltip title="Preview PDF">
                                        <Button variant="contained" color="secondary"   onClick={() => this.pdfExportComponent.save()}>
                                        <PrintIcon />
                                             PDF
                                         </Button>
                                         </Tooltip>
                                    </Grid>
                                    <Grid item xs={12} sm={4} >
                                    <Tooltip title="Edit temlate">
                                        <Link to="/edit-template"><Button variant="contained" color="secondary" >
                                            <EditIcon />
                                            Edit
                                        </Button>
                                        </Link>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                    </Grid>
                                </Grid>
                            </Container>
                        </ThemeProvider>
                    </div>
                    <PDFExport pageTemplate={PageTemplate}
                        fileName={this.state.customer_name + this.state.bill_monthly_cost + '.pdf'}
                        paperSize="A4"
                        margin="1cm"
                        ref={(component) => this.pdfExportComponent = component}>
                        <ThemeProvider theme={th}>
                            <Container component="main" maxWidth="sm" style={{ backgroundColor: 'white' }} >
                                <CssBaseline />
                                <form noValidate onSubmit={event => this.handleSubmitForm(event)}>
                                    <main >
                                        <div style={{ marginTop: '20px' }} >
                                            <Grid container spacing={1}>
                                                <Grid item xs={2} style={{ height: 'auto' }} justify-xs-space-between="true"	>
                                                    <img src={logotma} width="90px" alt="vvn" />
                                                </Grid>
                                                <Grid item xs={10} style={{ height: 'auto' }} justify-xs-space-between="true"	>
                                                    <Typography style={{ fontSize: '9px' }} align='right'>&nbsp;&nbsp;</Typography>
                                                    <Typography style={{ fontSize: '9px'  }} align='right'>{this.state.templates_name_company}</Typography>
                                                    <Typography style={{ fontSize: '9px' }} align='right'>{this.state.templates_address}</Typography>
                                                    <Typography style={{ fontSize: '9px' }} align='right'>Phone: {this.state.templates_phone} - E-mail: {this.state.templates_email}</Typography>
                                                </Grid>
                                                <Grid item xs={5} style={{ height: 'auto' }}>
                                                    <Typography variant="h5" style={{ fontWeight: 'bold' }}>INVOICE</Typography>
                                                </Grid>
                                                
                                                <Grid item xs={7} style={{height: 'auto', color: '#2196f3' }} className="border border-primary">
                                                    <div className="row"  >
                                                        <div className="col-sm-7" style={{ fontSize: '10px' }}>TMA reference number:</div>
                                                        <div className="col-sm-5" style={{ fontSize: '10px', fontWeight: 'bold' }} >
                                                            {this.state.bill_reference}
                                                    </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-sm-7" style={{ fontSize: '10px' }}>PO No</div>
                                                        <div className="col-sm-5" style={{ fontSize: '10px', fontWeight: 'bold' }} >
                                                            {this.state.bill_no}
                                                    </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-sm-7" style={{ fontSize: '10px' }}>Date: </div>
                                                        <div className="col-sm-5" style={{ fontSize: '10px', fontWeight: 'bold' }} >
                                                            {this.state.bill_date}
                                                        </div>
                                                    </div>
                                                </Grid>
                                                <Grid item xs={6} >
                                                    <div className="row">
                                                        <div className="col-sm-4" style={{ fontWeight: 'bold', fontSize: '10px' }}>To:</div>
                                                        <div className="col-sm-8" style={{ fontWeight: 'bold', fontSize: '10px' }}>
                                                            {this.state.customer_name}
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-sm-4" style={{ fontWeight: 'bold' }}></div>
                                                        <div className="col-sm-8" style={{ fontSize: '10px' }}>
                                                            {this.state.customer_address}
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-sm-4"></div>
                                                        <div className="col-sm-8" >PO No: <b style={{ fontWeight: 'bold', fontSize: '10px' }}> {this.state.bill_no}</b></div>
                                                    </div>
                                                </Grid>
                                                <Grid item xs={6} >
                                                </Grid>
                                                <Grid item xs={12} >
                                                    <div style={{ fontWeight: 'bold', fontSize: '10px' }}>Description:</div>
                                                </Grid>
                                                <Grid item xs={12} align-content-xs-flex-end="true" style={{ marginTop: '1px' }} >
                                                    <Typography align="center" style={{ fontWeight: 'bold', fontSize: '14px' }}>Monthly cost for Month </Typography>
                                                </Grid>

                                                <Grid item xs={12} >
                                                    
                                                    <div>
                                                    <style dangerouslySetInnerHTML={{__html: "\ntable {\n  border-collapse: collapse;\n  padding: 10px ;\n}\n\ntable {\n  border: 0.5px solid #2196f3;\n  margin: 0 auto;\n  width :100%;\n  padding: 6px ;\n}\n.k{\t\n\tborder-bottom:0.5px solid #2196f3;\n    border-right:0.5px solid #2196f3;\n   \tpadding: 6px ;\n}\n.v{\n\tborder-bottom:0.5px solid #2196f3;\n    padding: 6px ;\n    \n}\n.g{\n\t border-right:0.5px solid white;\n     padding: 6px ;\n}\n.f{\n\tpadding: 6px ;\n}\n" }} />

                                                        <table>
                                                            <tbody><tr >
                                                                <td className="k" align="center" style={{ width: '15%', fontsize: '9px', color:'#2196f3' }}><b>Item #</b></td>
                                                                <td className="k" align="center" style={{ fontsize: '9px' , color:'#2196f3'}}><b>Description</b></td>
                                                                <td className="v" align="center" style={{ width: '40%', fontsize: '9px', color:'#2196f3' }}><b>Payment Amount in USD</b></td>
                                                            </tr>
                                                            {this.state.data.map((row, index) => (
                                                                <tr style={{ height:"40px", fontsize: '10px' }}>
                                                                    <td className="k" align="center" style={{ width: '15%', fontsize: '9px' }}><b>{index + 1}</b></td>
                                                                    <td className="k" align="left" style={{ fontsize: '9px' }}>{row.bill_item_description}</td>
                                                                    <td  className="v" align="right" style={{ width: '40%', fontsize: '9px' }}>{row.bill_item_cost}</td>
                                                                </tr>

                                                                ))}
                                                                <tr style={{ backgroundColor: '#2196f3', color: 'white' }}>
                                                                    <td colSpan="2" className="g" align="right" style={{ width: '15%', fontsize: '10px' }}><b>Total</b></td>
                                                                   
                                                                    <td className="f" align="right" style={{ width: '40%', fontsize: '10px' }}> <b>{this.state.bills_sum.toLocaleString('vi')}</b></td>
                                                                </tr>
                                                            </tbody></table>

                                                    </div>
                                                
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <div className="row">
                                                        <div className="col-sm-12" style={{ fontWeight: 'bold', fontSize: '10px' }}>Total amount to be paid: ${this.state.bills_sum.toLocaleString('vi')}</div>
                                                    </div>
                                                </Grid>
                                                <Grid item xs={12} >
                                                    <Typography align='left' style={{ fontSize: '10px' }}>Please pay by <a style={{ fontWeight: 'bold' }}>WIRE TRANSFER</a> the above amount to our account:</Typography>
                                                </Grid>
                                                <Grid item xs={12} >
                                                    <div className="row" style={{ height: 'auto', backgroundColor: '#2196f3', color: 'white', margin: 'auto', width:'100%' }}>
                                                        <div className="col-sm-4" style={{ marginTop: '10px', fontSize: '10px' }}>Name on account :</div>
                                                        <div className="col-sm-8" style={{ marginTop: '10px', fontWeight: 'bold', fontSize: '10px' }}>{this.state.templates_name_on_account}</div>
                                                        <div className="col-sm-4" style={{ fontSize: '10px' }}>Account number  :</div>
                                                        <div className="col-sm-8" style={{ fontWeight: 'bold', fontSize: '10px' }}>
                                                            {this.state.account_bank_number}
                                                        </div>
                                                        <div className="col-sm-4" style={{ fontSize: '10px' }}>Bank Name :</div>
                                                        <div className="col-sm-8" style={{ fontWeight: 'bold', fontSize: '10px' }}>{this.state.account_bank_name}</div>
                                                        <div className="col-sm-4" style={{ fontSize: '10px' }}></div>
                                                        <div className="col-sm-8" style={{ fontWeight: 'bold', fontSize: '10px' }} >{this.state.account_bank_address}</div>
                                                        <div className="col-sm-4" ></div>
                                                        <div className="col-sm-8" style={{ fontWeight: 'bold', fontSize: '10px' }}>(SWIFT code: {this.state.account_bank_swift})</div>
                                                        <div className="col-sm-4" style={{ fontSize: '10px' }}>Tel:</div>
                                                        <div className="col-sm-8" style={{ fontWeight: 'bold', fontSize: '10px' }}>{this.state.templates_tel}</div>
                                                        <div className="col-sm-4" style={{ fontSize: '10px' }}>Fax:</div>
                                                        <div className="col-sm-8" style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '10px' }}>{this.state.templates_fax}</div>
                                                    </div>
                                                </Grid>
                                                <Grid item xs={12} >
                                                    <Typography style={{ fontSize: '15px', fontWeight: 'bold', fontSize: '10px' }} align='left'><br />{this.state.templates_sign}</Typography>
                                                </Grid>
                                                <Grid item xs={12} style={{ height: "20px" }}>
                                                </Grid>
                                                <Grid item xs={12} >
                                                    <Typography style={{ fontSize: '15px', fontWeight: 'bold', fontSize: '10px' }} align='left'>{this.state.templates_name_cfo}</Typography>
                                                    <Typography style={{ fontSize: '15px', fontWeight: 'bold', fontSize: '10px' }} align='left'>CFO</Typography>
                                                    <Typography style={{ fontSize: '15px', fontWeight: 'bold', fontSize: '10px' }} align='left'>Tel: {this.state.templates_tel_cfo}, extension: {this.state.templates_extension_cfo}</Typography>
                                                    <Typography style={{ fontSize: '15px', fontWeight: 'bold', fontSize: '10px' }} align='left'>Email: <a href={"mailto:"+this.state.templates_email_cfo}>{this.state.templates_email_cfo}</a></Typography>
                                                </Grid>
                                                <Grid item xs={12} style={{ height: "50px" }}>
                                                </Grid>
                                            </Grid>
                                        </div>
                                    </main>
                                </form>
                            </Container>
                        </ThemeProvider>
                    </PDFExport>
                    <ExcelExport
                    data={this.state.data}
                    fileName={this.state.customer_name + this.state.bill_monthly_cost+".xlsx"}
                    ref={(exporter) => { this._exporter = exporter; }}
                >
                 <ExcelExportColumnGroup title={"Monthly cost for " + m + " " + this.state.bill_monthly_cost.slice(0,4)} headerCellOptions={{ background: '#2196f3', textAlign: 'center' }}>
                 <ExcelExportColumn   title="Item #" field="in" width={100} cellOptions={{
                            textAlign: 'center'
                        }}/>
                    <ExcelExportColumn cellOptions={{ verticalAlign: 'center' }} field="bill_item_description"  title="Description" width={300} footer={CustomFooter} footerCellOptions={{ textAlign: 'right'}}/>
                    <ExcelExportColumn field="bill_item_cost"  title="Payment Amount in USD" width={250} footer={sumCost} footerCellOptions={{ textAlign: 'right'}} />
                    </ExcelExportColumnGroup>
                </ExcelExport>
                </div>
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
export default connect(mapStateToProps)(DetailBill);