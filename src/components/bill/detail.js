import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import blue from '@material-ui/core/colors/blue';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import logotma from './logotma.png';
import { Redirect } from 'react-router'
import { connect } from "react-redux";
import Doc from './docService';
import Button from '@material-ui/core/Button';
import PrintIcon from '@material-ui/icons/Print';
import EditIcon from '@material-ui/icons/Edit';
import PageTemplate from './pagetemlate';
import { PDFExport } from '@progress/kendo-react-pdf';
import { Link } from "react-router-dom";
import NotFound from '../views/NotFound';
import { month } from '../share/month';
import {
    ExcelExport,
    ExcelExportColumn,
    ExcelExportColumnGroup
} from '@progress/kendo-react-excel-export';
import { aggregateBy } from '@progress/kendo-data-query';
import { Tooltip, Paper, Breadcrumbs } from '@material-ui/core';
import { getCustomerUserCurrent } from '../share/services/customer.service';
import { getBill } from '../share/services/bill.service';
import { th } from "../share/config";


const aggregates = [{ field: 'bill_item_cost', aggregate: 'SUM' }];
const total = (props) => (aggregateBy(props.data, aggregates));
const URL_EDIT = "/bills/edit/";

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
            columns: [
                { title: 'Description', field: 'bill_item_description' },
                { title: 'Payment Amount in USD', field: 'bill_item_cost', type: 'numeric' },
            ],
            data: [
            ],
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
            account_bank_number: '',
            account_bank_address: '',
            account_bank_swift: '',
            redirect: false,
            bill_no: '',
            bill_reference: '',
            bill_content: '',
            po_nos: [],
            bill_display_po: '',
            templates_name_company: '',
            templates_address: '',
            templates_phone: '',
            templates_email: '',
            templates_name_on_account: '',
            templates_tel: '',
            templates_fax: '',
            templates_sign: '',
            bill_id: 1,
            templates_name_cfo: '',
            templates_tel_cfo: '',
            templates_extension_cfo: '',
            templates_email_cfo: '',
        }
        this.componentWillMount = this.componentDidMount.bind(this);
        document.title = 'Export Bill'
    }
    componentDidMount() {
        getCustomerUserCurrent(this.props.user_username, this.props.token).then(data => {
            this.setState({
                customers: data.customers
            })
        });
        getBill(this.props.match.params.id, this.props.user_username, this.props.token).then(data => {
            this.setState({
                data: data.items,
                accountbanks: data.accountsbank,
                account_bank_id: data.bill.account_bank_id,
                account_bank_name: data.bill.account_bank_name,
                account_bank_number: data.bill.account_bank_number,
                account_bank_address: data.bill.account_bank_address,
                account_bank_swift: data.bill.account_bank_swift,
                customer_id: data.bill.customer_id,
                customer_name: data.bill.customer_name,
                customer_address: data.bill.customer_address,
                bill_monthly_cost: data.bill.bill_monthly_cost,
                bill_date: data.bill.bill_date.slice(0, 10),
                bill_no: data.bill.bill_no,
                bill_reference: data.bill.bill_reference,
                bill_content: data.bill.bill_content,
                bill_display_po: data.po_number.po_number_no,
                templates_name_company: data.temp.templates_name_company,
                templates_address: data.temp.templates_address,
                templates_phone: data.temp.templates_phone,
                templates_email: data.temp.templates_email,
                templates_name_on_account: data.temp.templates_name_on_account,
                templates_tel: data.temp.templates_tel,
                templates_fax: data.temp.templates_fax,
                templates_sign: data.temp.templates_sign,
                bill_id: data.temp.bill_id,
                templates_name_cfo: data.temp.templates_name_cfo,
                templates_tel_cfo: data.temp.templates_tel_cfo,
                templates_extension_cfo: data.temp.templates_extension_cfo,
                templates_email_cfo: data.temp.templates_email_cfo,
            });
        })
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
        this.state.data.map((data, index) => {
            var k = Number(data.bill_item_cost);
            data.cost = k.toLocaleString('vi');

        });
        this.state.data.map((key, index) => {
            key.in = index + 1;
        });
        this.state.bills_sum = this.state.data.reduce((total, item) => total + parseInt(item.bill_item_cost, 10), 0);
        const redirect = this.state.redirect;
        const m = month(this.state.bill_monthly_cost.slice(5, 7));
        const sumCost = (props) => (`${this.state.bills_sum}`);
        if (redirect) {
            return <Redirect to='/bill-list' />;
        }
        if( ((this.props.role === 'Director') && (localStorage.getItem('user_information'))) || ((this.props.role === 'Sr.Director') && (localStorage.getItem('user_information')))){
            return (
                <div >
                    <div className="example-config">
                        <ThemeProvider theme={th}>
                            <Container component="main" maxWidth="sm" >
                                <Paper elevation={0}  style={{ marginTop: '2%'}} >
                                    <Breadcrumbs aria-label="Breadcrumb" separator="/">
                                        <Link style={{ color: '#3f51b5' }} to="/" >
                                            Home
                                        </Link>
                                        <Link style={{ color: '#3f51b5' }} to="/bills" >
                                            Bills
                                        </Link>
                                        <Typography color="textPrimary">Export</Typography>
                                    </Breadcrumbs>
                                </Paper>
                                <Grid container spacing={3} >
                                    <Grid item xs={12} >
                                    </Grid>
                                    <Grid item xs={12} sm={6} align="right">
                                        <Tooltip title="Export Bill to PDF">
                                            <Button variant="contained" color="primary" onClick={() => this.pdfExportComponent.save()}>
                                                <PrintIcon />
                                                PDF
                                         </Button>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={12} sm={6} >
                                        <Tooltip title="Edit Bill">
                                            <Link to={URL_EDIT + this.props.match.params.id}><Button variant="contained" color="primary" >
                                                <EditIcon />
                                                Edit
                                        </Button>
                                            </Link>
                                        </Tooltip>
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
                                                    <Typography style={{ fontSize: '9px', fontFamily: 'Times New Roman' }} align='right'>{this.state.templates_name_company}</Typography>
                                                    <Typography style={{ fontSize: '9px', fontFamily: 'Times New Roman' }} align='right'>Address: {this.state.templates_address}</Typography>
                                                    <Typography style={{ fontSize: '9px', fontFamily: 'Times New Roman' }} align='right'>Phone: {this.state.templates_phone} - E-mail: {this.state.templates_email}</Typography>
                                                </Grid>
                                                <Grid item xs={5} style={{ height: 'auto' }}>
                                                    <Typography variant="h5" style={{ fontWeight: 'bold', fontFamily: 'Times New Roman' }}>INVOICE</Typography>
                                                </Grid>

                                                <Grid item xs={7} style={{ height: 'auto', color: '#2196f3' }} className="border border-primary">
                                                    <div className="row"  >
                                                        <div className="col-sm-7" style={{ fontSize: '11px', fontFamily: 'Times New Roman' }}>TMA reference number:</div>
                                                        <div className="col-sm-5" style={{ fontSize: '11px', fontWeight: 'bold', fontFamily: 'Times New Roman' }} >
                                                            {this.state.bill_reference}
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-sm-7" style={{ fontSize: '11px', fontFamily: 'Times New Roman' }}>PO No</div>
                                                        <div className="col-sm-5" style={{ fontSize: '11px', fontWeight: 'bold', fontFamily: 'Times New Roman' }} >
                                                            {this.state.bill_display_po}
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-sm-7" style={{ fontSize: '11px', fontFamily: 'Times New Roman' }}>Date: </div>
                                                        <div className="col-sm-5" style={{ fontSize: '11px', fontWeight: 'bold', fontFamily: 'Times New Roman' }} >
                                                            {this.state.bill_date}
                                                        </div>
                                                    </div>
                                                </Grid>
                                                <Grid item xs={6} >
                                                    <div className="row">
                                                        <div className="col-sm-4" style={{ color: '#808080', fontSize: '11px', fontFamily: 'Times New Roman' }}>To:</div>
                                                        <div className="col-sm-8" style={{ fontWeight: 'bold', fontSize: '11px', fontFamily: 'Times New Roman' }}>
                                                            {this.state.customer_name}
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-sm-4" style={{ fontWeight: 'bold', fontFamily: 'Times New Roman' }}></div>
                                                        <div className="col-sm-8" style={{ fontSize: '11px', fontFamily: 'Times New Roman' }}>
                                                            {this.state.customer_address}
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-sm-4"></div>
                                                        <div className="col-sm-8" style={{ fontFamily: 'Times New Roman' }} >PO No: <b style={{ fontWeight: 'bold', fontSize: '11px' }}> {this.state.bill_display_po}</b></div>
                                                    </div>
                                                </Grid>
                                                <Grid item xs={6} >
                                                </Grid>
                                                <Grid item xs={12} >
                                                    <div style={{ color: '#808080', fontSize: '11px', fontFamily: 'Times New Roman' }}>Description:</div>
                                                </Grid>
                                                <Grid item xs={12} align-content-xs-flex-end="true" style={{ marginTop: '1px' }} >
                                                    <Typography align="center" style={{ fontWeight: 'bold', fontSize: '16px', fontFamily: 'Times New Roman' }}>{this.state.bill_content} {m} {this.state.bill_monthly_cost.slice(0, 4)} </Typography>
                                                </Grid>

                                                <Grid item xs={12} >

                                                    <div>
                                                        <style dangerouslySetInnerHTML={{ __html: "\ntable {\n  border-collapse: collapse;\n  padding: 11px ;\n}\n\ntable {\n  border: 0.5px solid #2196f3;\n  margin: 0 auto;\n  width :100%;\n  padding: 6px ;\n}\n.k{\t\n\tborder-bottom:0.5px solid #2196f3;\n    border-right:0.5px solid #2196f3;\n   \tpadding: 6px ;\n}\n.v{\n\tborder-bottom:0.5px solid #2196f3;\n    padding: 6px ;\n    \n}\n.g{\n\t border-right:0.5px solid white;\n     padding: 6px ;\n}\n.f{\n\tpadding: 6px ;\n}\n" }} />

                                                        <table>
                                                            <tbody><tr >
                                                                <td className="k" align="center" style={{ width: '15%', color: '#2196f3', fontWeight: 'bold', fontFamily: 'Times New Roman', fontsize: '7px' }}>Item #</td>
                                                                <td className="k" align="center" style={{ color: '#2196f3', fontWeight: 'bold', fontFamily: 'Times New Roman', fontsize: '7px' }}>Description</td>
                                                                <td className="v" align="center" style={{ width: '40%', color: '#2196f3', fontWeight: 'bold', fontFamily: 'Times New Roman', fontsize: '7px' }}>Payment Amount in USD</td>
                                                            </tr>
                                                                {this.state.data.map((row, index) => (
                                                                    <tr style={{ height: "40px" }} key={index}>
                                                                        <td className="k" align="center" style={{ width: '15%', fontFamily: 'Times New Roman', fontsize: '8px', fontWeight: 'bold' }}>{row.in}</td>
                                                                        <td className="k" align="left" style={{ fontFamily: 'Times New Roman', fontsize: '8px' }}>{row.bill_item_description}</td>
                                                                        <td className="v" align="right" style={{ width: '40%', fontFamily: 'Times New Roman', fontsize: '8px' }}>{row.cost}</td>
                                                                    </tr>

                                                                ))}
                                                                <tr style={{ backgroundColor: '#2196f3', color: 'white' }}>
                                                                    <td colSpan="2" className="g" align="right" style={{ width: '15%', fontFamily: 'Times New Roman', fontsize: '5px', fontWeight: 'bold' }}>Total</td>
                                                                    <td className="f" align="right" style={{ width: '40%', fontFamily: 'Times New Roman', fontsize: '5px', fontWeight: 'bold' }}>{this.state.bills_sum.toLocaleString('vi')}</td>
                                                                </tr>
                                                            </tbody></table>

                                                    </div>

                                                </Grid>
                                                <Grid item xs={12}>
                                                    <div className="row">
                                                        <div className="col-sm-12" style={{ fontSize: '11px', fontFamily: 'Times New Roman' }}><a style={{ color: '#808080', fontSize: '12px', fontFamily: 'Times New Roman' }}>Total amount to be paid: &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</a> ${this.state.bills_sum.toLocaleString('vi')}</div>
                                                    </div>
                                                </Grid>
                                                <Grid item xs={12} >
                                                    <Typography align='left' style={{ fontSize: '12px', fontFamily: 'Times New Roman' }}>Please pay by <a style={{ fontWeight: 'bold', fontFamily: 'Times New Roman' }}>WIRE TRANSFER</a> the above amount to our account:</Typography>
                                                </Grid>
                                                <Grid item xs={12} >
                                                    <div className="row" style={{ height: 'auto', backgroundColor: '#2196f3', color: 'white', margin: 'auto', width: '100%' }}>
                                                        <div className="col-sm-4" style={{ marginTop: '11px', fontSize: '11px', fontFamily: 'Times New Roman' }}>Name on account :</div>
                                                        <div className="col-sm-8" style={{ marginTop: '11px', fontWeight: 'bold', fontSize: '11px', fontFamily: 'Times New Roman' }}>{this.state.templates_name_on_account}</div>
                                                        <div className="col-sm-4" style={{ fontSize: '11px', fontFamily: 'Times New Roman' }}>Account number  :</div>
                                                        <div className="col-sm-8" style={{ fontWeight: 'bold', fontSize: '11px', fontFamily: 'Times New Roman' }}>
                                                            {this.state.account_bank_number}
                                                        </div>
                                                        <div className="col-sm-4" style={{ fontSize: '11px', fontFamily: 'Times New Roman' }}>Bank Name :</div>
                                                        <div className="col-sm-8" style={{ fontWeight: 'bold', fontSize: '11px', fontFamily: 'Times New Roman' }}>{this.state.account_bank_name}</div>
                                                        <div className="col-sm-4" style={{ fontSize: '11px' }}></div>
                                                        <div className="col-sm-8" style={{ fontWeight: 'bold', fontSize: '11px', fontFamily: 'DejaVu Sans' }} >{this.state.account_bank_address}</div>
                                                        <div className="col-sm-4" ></div>
                                                        <div className="col-sm-8" style={{ fontWeight: 'bold', fontSize: '11px', fontFamily: 'Times New Roman' }}>(SWIFT code: {this.state.account_bank_swift})</div>
                                                        <div className="col-sm-4" style={{ fontSize: '11px', fontFamily: 'Times New Roman' }}>Tel:</div>
                                                        <div className="col-sm-8" style={{ fontWeight: 'bold', fontSize: '11px', fontFamily: 'Times New Roman' }}>{this.state.templates_tel}</div>
                                                        <div className="col-sm-4" style={{ fontSize: '11px', fontFamily: 'Times New Roman' }}>Fax:</div>
                                                        <div className="col-sm-8" style={{ fontWeight: 'bold', marginBottom: '11px', fontSize: '11px', fontFamily: 'Times New Roman' }}>{this.state.templates_fax}</div>
                                                    </div>
                                                </Grid>
                                                <Grid item xs={12} >
                                                    <Typography style={{ fontWeight: 'bold', fontSize: '11px', fontFamily: 'Times New Roman' }} align='left'><br />{this.state.templates_sign}</Typography>
                                                </Grid>
                                                <Grid item xs={12} style={{ height: "20px" }}>
                                                </Grid>
                                                <Grid item xs={12} >
                                                    <Typography style={{ fontWeight: 'bold', fontSize: '11px', fontFamily: 'Times New Roman' }} align='left'>{this.state.templates_name_cfo}</Typography>
                                                    <Typography style={{ fontWeight: 'bold', fontSize: '11px', fontFamily: 'Times New Roman' }} align='left'>CFO</Typography>
                                                    <Typography style={{ fontWeight: 'bold', fontSize: '11px', fontFamily: 'Times New Roman' }} align='left'>Tel: {this.state.templates_tel_cfo}, extension: {this.state.templates_extension_cfo}</Typography>
                                                    <Typography style={{ fontWeight: 'bold', fontSize: '11px', fontFamily: 'Times New Roman' }} align='left'>Email:  <a href={"mailto:" + this.state.templates_email_cfo} style={{ paddingBottom: '2px', borderBottom: '1px solid #2196f3' }}> {this.state.templates_email_cfo}</a></Typography>
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
                        fileName={this.state.customer_name + this.state.bill_monthly_cost + ".xlsx"}
                        ref={(exporter) => { this._exporter = exporter; }}
                    >
                        <ExcelExportColumnGroup title={"Monthly cost for " + m + " " + this.state.bill_monthly_cost.slice(0, 4)} headerCellOptions={{ background: '#2196f3', textAlign: 'center' }}>
                            <ExcelExportColumn title="Item #" field="in" width={100} cellOptions={{
                                textAlign: 'center'
                            }} />
                            <ExcelExportColumn cellOptions={{ verticalAlign: 'center' }} field="bill_item_description" title="Description" width={300} footer={CustomFooter} footerCellOptions={{ textAlign: 'right' }} />
                            <ExcelExportColumn field="bill_item_cost" title="Payment Amount in USD" width={250} footer={sumCost} footerCellOptions={{ textAlign: 'right' }} />
                        </ExcelExportColumnGroup>
                    </ExcelExport>
                </div>
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
        user_username: state.loginReducer.user_username,
        role: state.loginReducer.role,
        token: state.loginReducer.token
    };
}
export default connect(mapStateToProps)(DetailBill);