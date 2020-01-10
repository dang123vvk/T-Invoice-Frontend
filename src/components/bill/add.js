import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { ThemeProvider } from '@material-ui/styles';
import logotma from './logotma.png';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { Button, TextField, Paper, Table, TableHead, TableRow, TableBody, TableCell, IconButton, Tooltip, Dialog, DialogContent, DialogTitle, DialogActions, Fab, FormHelperText, InputLabel } from '@material-ui/core';
import { Redirect } from 'react-router'
import { connect } from "react-redux";
import NotFound from '../views/NotFound';
import { Link } from "react-router-dom";
import { month } from '../share/month';
import './style.css';
import { getTemplate, getTemplateCustomer } from '../share/services/template.service';
import { getAccountBankCurrent } from '../share/services/accountbank.service';
import { getCustomerUserCurrent, getCustomerPO } from '../share/services/customer.service';
import { getStatusBill, postBill } from '../share/services/bill.service';
import { th } from "../share/config";
import AddOutlinedIcon from '@material-ui/icons/AddOutlined';
import Draggable from 'react-draggable';
import _ from 'lodash';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
function PaperComponent(props) {
    return (
        <Draggable cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}

class AddBill extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bill_item_description: '',
            bill_item_cost: 0,
            data: [],
            templates_name_company: '',
            templates_address: '',
            templates_phone: '',
            templates_email: '',
            templates_name_on_account: '',
            templates_tel: '',
            templates_fax: '',
            templates_sign: '',
            templates_name_cfo: '',
            templates_tel_cfo: '',
            templates_extension_cfo: '',
            templates_email_cfo: '',
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
            bill_reference: '',
            temp: 0,
            status: [],
            month_1: '',
            bill_content: 'Monthly cost for',
            po_nos: [],
            bill_display_po: '',
            swiftcode: '',
            display_po: false,
            isDialog: false,
            dialogTitle: 'Add',
            isAdd: true,
            item_id: '',
            messageDescription: '',
            errorDescription: false,
            messageCost: '',
            errorCost: false,
            messageItem: ' ',
            errorItem: false,
        }
        this.componentWillMount = this.componentDidMount.bind(this);
        this.cancel = this.cancel.bind(this);
        this.onChange = this.onChange.bind(this);
        this.default = this.default.bind(this);
        this.customerdefault = this.customerdefault.bind(this);
        document.title = 'Add Bill';
        this.openAdd = this.openAdd.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
        this.actionItem = this.actionItem.bind(this);
        this.openEdit = this.openEdit.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.onChangeNumber = this.onChangeNumber.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
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
            month_1: month(month1) + year,
        });

        //template
        getTemplate(this.props.token).then(data => {
            this.setState({
                templates_name_company: data.temp.templates_name_company,
                templates_address: data.temp.templates_address,
                templates_phone: data.temp.templates_phone,
                templates_email: data.temp.templates_email,
                templates_name_on_account: data.temp.templates_name_on_account,
                templates_tel: data.temp.templates_tel,
                templates_fax: data.temp.templates_fax,
                templates_sign: data.temp.templates_sign,
                templates_name_cfo: data.temp.templates_name_cfo,
                templates_tel_cfo: data.temp.templates_tel_cfo,
                templates_extension_cfo: data.temp.templates_extension_cfo,
                templates_email_cfo: data.temp.templates_email_cfo,
            });
        })
        getAccountBankCurrent(this.props.token).then(data => {
            this.setState({
                accountbanks: data.accountsbank,
                account_bank_id: data.accountsbank[0].account_bank_id,
                account_bank_name: data.accountsbank[0].account_bank_name,
                account_bank_address: data.accountsbank[0].account_bank_address,
                account_bank_swift: data.accountsbank[0].account_bank_swift,
            });
        })
        getCustomerUserCurrent(this.props.user_username, this.props.token).then(data => {
            if (data.length_po_nos_add > 0) {
                this.setState({
                    customers: data.customers,
                    customer_id: data.customers[0].customer_id,
                    swiftcode: data.customers[0].customer_swift_code,
                    bill_reference: (this.state.month_1 + data.customers[0].customer_swift_code).toUpperCase(),
                    customer_address: data.customers[0].customer_address,
                    bill_no: data.po_nos_add[0].po_number_id,
                    bill_display_po: data.po_nos_add[0].po_number_no,
                    po_nos: data.po_nos_add,
                    display_po: false,
                });
            }
            else {
                this.setState({
                    customers: data.customers,
                    customer_id: data.customers[0].customer_id,
                    swiftcode: data.customers[0].customer_swift_code,
                    bill_reference: (this.state.month_1 + data.customers[0].customer_swift_code).toUpperCase(),
                    customer_address: data.customers[0].customer_address,
                    display_po: true,
                });
            }
        })
        getStatusBill(this.props.token).then(data => {
            this.setState({
                status: data.status
            });
        })
    }
    //default template
    default(e) {
        e.preventDefault();
        getTemplate(this.props.token).then(data => {
            this.setState({
                templates_name_company: data.temp.templates_name_company,
                templates_address: data.temp.templates_address,
                templates_phone: data.temp.templates_phone,
                templates_email: data.temp.templates_email,
                templates_name_on_account: data.temp.templates_name_on_account,
                templates_tel: data.temp.templates_tel,
                templates_fax: data.temp.templates_fax,
                templates_sign: data.temp.templates_sign,

                templates_name_cfo: data.temp.templates_name_cfo,
                templates_tel_cfo: data.temp.templates_tel_cfo,
                templates_extension_cfo: data.temp.templates_extension_cfo,
                templates_email_cfo: data.temp.templates_email_cfo,
            });
        })
    }
    closeDialog(e) {
        e.preventDefault();
        this.setState({
            isDialog: false,
            isAdd: true
        })
    }
    customerdefault(e) {
        e.preventDefault();
        getTemplateCustomer(this.state.customer_id, this.props.token).then(data => {
            this.setState({
                templates_name_company: data.temp.templates_name_company,
                templates_address: data.temp.templates_address,
                templates_phone: data.temp.templates_phone,
                templates_email: data.temp.templates_email,
                templates_name_on_account: data.temp.templates_name_on_account,
                templates_tel: data.temp.templates_tel,
                templates_fax: data.temp.templates_fax,
                templates_sign: data.temp.templates_sign,
                templates_name_cfo: data.temp.templates_name_cfo,
                templates_tel_cfo: data.temp.templates_tel_cfo,
                templates_extension_cfo: data.temp.templates_extension_cfo,
                templates_email_cfo: data.temp.templates_email_cfo,
            });
        })
    }
    handleSubmitForm(event) {
        event.preventDefault();
        const bill = this.state;
        postBill(bill, this.props.token).then(data => {
            this.setState({ redirect: true });
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
        var month2 = value.slice(5, 7);
        this.setState({
            bill_monthly_cost: value,
            month_1: month(month2) + value.slice(0, 4),
            bill_reference: (month(month2) + value.slice(0, 4) + this.state.swiftcode).toUpperCase(),
        });
    }
    handleChange(event) {
        this.setState({
            customer_id: event.target.value,
        });
        getCustomerPO(event.target.value, this.props.token).then(data => {
            if (data.length_po_nos_add > 0) {
                this.setState({
                    bill_no: data.po_nos_add[0].po_number_id,
                    bill_display_po: data.po_nos_add[0].po_number_no,
                    po_nos: data.po_nos_add,
                    display_po: false,
                });
            }
            else {
                this.setState({
                    display_po: true,
                });
            }
        })
        this.state.customers.map(customer => {
            if (customer.customer_id === event.target.value) {
                this.setState({
                    customer_address: customer.customer_address,
                    bill_reference: (this.state.month_1 + customer.customer_swift_code).toUpperCase(),
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
    cancel(e) {
        this.setState({
            redirect: true
        })
    }
    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    onChangeDescription(e) {
        if (!e.target.value) {
            this.setState({
                errorDescription: true,
                messageDescription: 'Field can not empty',
                [e.target.name]: '',
            });
        }
        else {
            this.setState({
                [e.target.name]: e.target.value,
                errorDescription: false,
                messageDescription: ' ',
            });
        }
    }

    onChangeNumber(e) {
        if (!e.target.value) {
            this.setState({
                [e.target.name]: e.target.value,
                messageCost: 'Field can not empty',
                errorCost: true
            });
        }
        else {
            this.setState({
                [e.target.name]: e.target.value,
                messageCost: ' ',
                errorCost: false
            });
        }

    }
    openAdd(e) {
        e.preventDefault();
        this.setState({
            isDialog: true,
            bill_item_description: '',
            bill_item_cost: 0,
            isAdd: true,
            dialogTitle: 'Add',
            messageItem: ' ',
            messageCost: ' ',
            messageDescription: ' '
        })
    }
    openEdit(e, bill_item_description) {
        e.preventDefault();
        let index = _.findIndex(this.state.data, it => { return it.bill_item_description === bill_item_description; });
        var data = this.state.data;
        this.setState({
            isDialog: true,
            item_id: bill_item_description,
            bill_item_description: bill_item_description,
            bill_item_cost: data[index].bill_item_cost,
            isAdd: false,
            dialogTitle: 'Edit ',
            messageItem: ' ',
            messageCost: ' ',
            messageDescription: ' '
        })
    }
    actionItem(e) {
        e.preventDefault();
        if (this.state.isAdd) {
            const item = {
                bill_item_description: this.state.bill_item_description,
                bill_item_cost: this.state.bill_item_cost,
            };
            let index = _.findIndex(this.state.data, it => { return it.bill_item_description === this.state.bill_item_description; });
            if (index === -1) {
                this.setState(state => {
                    const list = state.data.push(item);
                    return {
                        list,
                        isDialog: false,
                        bill_item_description: '',
                        bill_item_cost: 0,
                        dialogTitle: 'Add PO No',
                        messageItem: ' ',
                        errorItem: false
                    };
                });
            }
            else {
                this.setState({
                    messageItem: 'Item already exists',
                    errorItem: true
                })
            }

        }
        else {
            const item = {
                bill_item_description: this.state.bill_item_description,
                bill_item_cost: this.state.bill_item_cost,
            };
            let index = _.findIndex(this.state.data, it => { return it.bill_item_description === this.state.item_id; });
            const data = this.state.data;
            data[index] = item;
            this.setState({
                isDialog: false,
                isAdd: true,
                data: data,
                messageItem: ' ',
                errorItem: false
            })
        }
    }
    deleteItem(e, i) {
        e.preventDefault();
        var data = _.filter(this.state.data, function (item) {
            return item.bill_item_description != i
        })
        this.setState({
            data: data,
        })
    }
    render() {
        this.state.bills_sum = this.state.data.reduce((total, item) => total + parseInt(item.bill_item_cost, 10), 0);
        const redirect = this.state.redirect;
        if (redirect) {
            return <Redirect to='/bills' />;
        }
        if ((this.props.role) || (localStorage.getItem('user_information'))) {
            return (
                <ThemeProvider theme={th}>
                    <Container component="main" maxWidth="md" style={{ backgroundColor: 'white' }} >
                        <CssBaseline />
                        <form validate="true" onSubmit={event => this.handleSubmitForm(event)}>
                            <main >
                                <div style={{ marginTop: '20px' }} >
                                    <Grid container spacing={3}>
                                        <Grid item xs={3} style={{ height: 'auto' }} justify-xs-space-between="true"	>
                                            <img src={logotma} width="150px" alt="vvn" />
                                        </Grid>
                                        <Grid item xs={9} style={{ height: '100px' }} justify-xs-space-between="true"	>
                                            <Typography style={{ fontSize: '15px', fontWeight: 'bold' }} align='right'>&nbsp;&nbsp;</Typography>
                                            <Input
                                                style={{ width: '100%', fontSize: '13px' }}
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
                                                style={{ width: '90%', fontSize: '13px' }}
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
                                                style={{ width: '40%', fontSize: '13px' }}
                                                type="text"
                                                value={this.state.templates_phone}
                                                inputProps={{
                                                    'aria-label': 'Description',
                                                }}
                                                name="templates_phone"
                                                onChange={this.onChange}
                                                required
                                            /> <b>- E-mail:</b>   <Input
                                                style={{ width: '41%', fontSize: '13px' }}
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
                                            <div className="row" style={{ marginTop: '10px' }}>
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
                                                    There isn't an active PO. Please add in <Link to={'/customers/edit/' + this.state.customer_id}>this customer</Link>
                                                </div>
                                            </div>
                                            <div className="row" style={{ marginTop: '10px' }}>
                                                <div className="col-sm-8" style={{ fontWeight: 'bold' }}>Date: </div>
                                                <div className="col-sm-4" >
                                                    <Input
                                                        style={{ width: '150px' }}
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
                                                <div className="col-sm-8 time-new" style={{ marginTop: '1%' }}>
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
                                        <Grid item xs={6} container justify="flex-end" alignItems="flex-end" >
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
                                            <Typography align="right" style={{ fontWeight: 'bold' }}>
                                                <Tooltip title='Add'><IconButton className='btn-without-border' color='primary' onClick={this.openAdd}>
                                                    <AddOutlinedIcon />
                                                </IconButton></Tooltip>
                                            </Typography>
                                            <Table className="table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell align="right">Item #</TableCell>
                                                        <TableCell align="right">Description</TableCell>
                                                        <TableCell align="right">Payment Amount in USD</TableCell>
                                                        <TableCell align="right"></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {this.state.data.map((row, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell align="right">
                                                                {index + 1}
                                                            </TableCell>
                                                            <TableCell align="right">{row.bill_item_description}</TableCell>
                                                            <TableCell align="right">{row.bill_item_cost}</TableCell>
                                                            <TableCell align="right">
                                                                <Tooltip title="Edit" aria-label="add">
                                                                    <Fab size="small" color="primary" onClick={e => this.openEdit(e, row.bill_item_description)} className="btn-without-border">
                                                                        <EditIcon />
                                                                    </Fab>
                                                                </Tooltip>
                                                                <Tooltip title="Delete" aria-label="add" style={{ marginLeft: '2%' }}>
                                                                    <Fab size="small" color="secondary" onClick={e => this.deleteItem(e, row.bill_item_description)} className="btn-without-border">
                                                                        <DeleteIcon />
                                                                    </Fab>
                                                                </Tooltip>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                    <TableRow >
                                                        <TableCell align="right">
                                                        </TableCell>
                                                        <TableCell align="right"></TableCell>
                                                        <TableCell align="right"></TableCell>
                                                        <TableCell align="right">
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                            <Dialog PaperComponent={PaperComponent} open={this.state.isDialog} aria-labelledby="form-dialog-title">
                                                <DialogTitle id="form-dialog-title">{this.state.dialogTitle}</DialogTitle>
                                                <DialogContent >
                                                    <div id="configuration" className="container" ><br />
                                                        <div className="row d-flex align-items-center">
                                                            <div className="col-sm-12"><InputLabel error={this.state.errorItem}>{this.state.messageItem}</InputLabel> </div>
                                                            <div className="col-sm-5">Description </div>
                                                            <div className="col-sm-7">
                                                                <FormControl error={this.state.errorDescription}>
                                                                    <TextField
                                                                        margin="dense"
                                                                        variant="outlined"
                                                                        value={this.state.bill_item_description}
                                                                        fullWidth
                                                                        name="bill_item_description"
                                                                        onChange={this.onChangeDescription}
                                                                        error={this.state.errorDescription}
                                                                    />
                                                                    <FormHelperText id="component-error-text">{this.state.messageDescription}</FormHelperText>
                                                                </FormControl>
                                                            </div>
                                                            <div className="col-sm-5">Payment Amount in USD </div>
                                                            <div className="col-sm-7">
                                                                <FormControl error={this.state.errorCost}>
                                                                    <TextField
                                                                        margin="dense"
                                                                        variant="outlined"
                                                                        value={this.state.bill_item_cost}
                                                                        fullWidth
                                                                        name="bill_item_cost"
                                                                        onChange={this.onChangeNumber}
                                                                        type='number'
                                                                        error={this.state.errorCost}
                                                                    />
                                                                    <FormHelperText id="component-error-tex">{this.state.messageCost}</FormHelperText>
                                                                </FormControl>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                                <DialogActions>
                                                    <Button variant="contained" className="btn-without-border" onClick={this.closeDialog} style={{ backgroundColor: 'red', color: 'white' }}>
                                                        Cancel
                                        </Button>
                                                    <Button color="primary" className="btn-without-border" variant="contained" onClick={this.actionItem} >
                                                        Save
                                        </Button>
                                                </DialogActions>
                                            </Dialog>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <div className="row">
                                                <div className="col-sm-8"></div>
                                                <div className="col-sm-4" style={{ fontWeight: 'bold', fontSize: '15px' }}>Total amount to be paid: ${this.state.bills_sum}</div>
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} >
                                            <Typography style={{ fontSize: '15px' }} align='left'>Please pay by <a style={{ fontWeight: 'bold' }}>WIRE TRANSFER</a> the above amount to our account:</Typography>
                                        </Grid>
                                        <Grid item xs={12} >
                                            <div className="row border border-primary" style={{ height: 'auto' }}>
                                                <div className="col-sm-4" style={{ fontWeight: 'bold', marginTop: '10px' }}>
                                                    Name on account :
                                            </div>
                                                <div className="col-sm-8" style={{ fontWeight: 'bold', marginTop: '10px' }}> <Input
                                                    style={{ width: '50%', fontSize: '13px' }}
                                                    type="text"
                                                    value={this.state.templates_name_on_account}
                                                    inputProps={{
                                                        'aria-label': 'Description',
                                                    }}
                                                    name="templates_name_on_account"
                                                    onChange={this.onChange}
                                                    required
                                                /></div>
                                                <div className="col-sm-4" style={{ fontWeight: 'bold', marginTop: '10px' }}>Account number  :</div>
                                                <div className="col-sm-8" style={{ fontWeight: 'bold', marginTop: '10px' }}>
                                                    <FormControl >
                                                        <Select
                                                            value={this.state.account_bank_id}
                                                            onChange={event => this.handleChangeAccount(event)}>
                                                            {this.state.accountbanks.map(accountbank => (
                                                                <MenuItem key={accountbank.account_bank_id} value={accountbank.account_bank_id} >
                                                                    {accountbank.account_bank_number}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                                <div className="col-sm-4" style={{ fontWeight: 'bold', marginTop: '10px' }}>Bank Name :</div>
                                                <div className="col-sm-8" style={{ marginTop: '10px' }}>{this.state.account_bank_name}</div>
                                                <div className="col-sm-4" style={{ marginTop: '10px' }}></div>
                                                <div className="col-sm-8" style={{ marginTop: '10px' }} >{this.state.account_bank_address}</div>
                                                <div className="col-sm-4" style={{ marginTop: '10px' }}></div>
                                                <div className="col-sm-8" style={{ marginTop: '10px' }}>(SWIFT code: {this.state.account_bank_swift})</div>
                                                <div className="col-sm-4" style={{ fontWeight: 'bold', marginTop: '10px' }}>Tel:</div>
                                                <div className="col-sm-8" style={{ fontWeight: 'bold', marginTop: '10px' }}>
                                                    <Input
                                                        style={{ width: '50%', fontSize: '13px' }}
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
                                                <div className="col-sm-8" style={{ fontWeight: 'bold', marginTop: '10px', marginBottom: '10px' }}>
                                                    <Input
                                                        style={{ width: '50%', fontSize: '13px' }}
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
                                                style={{ width: '40%', fontSize: '13px' }}
                                                type="text"
                                                value={this.state.templates_sign}
                                                inputProps={{
                                                    'aria-label': 'Description',
                                                }}
                                                name="templates_sign"
                                                onChange={this.onChange}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12} >
                                            <Input
                                                style={{ width: '40%', fontSize: '13px' }}
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
                                                style={{ width: '20%', fontSize: '13px' }}
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
                                                style={{ width: '20%', fontSize: '13px' }}
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
                                                style={{ width: '20%', fontSize: '13px' }}
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
                                                <Button className='btn-without-border' style={{ color: 'white', backgroundColor: 'red' }} fullWidth type="button" size="large" color="primary" variant="contained" onClick={this.cancel} >Cancel</Button>
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4} >
                                            <Typography style={{ fontSize: '15px', fontWeight: 'bold' }} align='center'>
                                                <Button className='btn-without-border' fullWidth type="submit" size="large" color="primary" variant="contained" >Save</Button>
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
        user_username: state.loginReducer.user_username,
        role: state.loginReducer.role,
        token: state.loginReducer.token
    };
}
export default connect(mapStateToProps)(AddBill);