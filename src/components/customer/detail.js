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
import { FormControl, Paper, Breadcrumbs, Table, TableHead, TableCell, TableBody, TableRow, Fab } from '@material-ui/core';
import { Redirect } from 'react-router'
import { connect } from "react-redux";
import Axios from 'axios';
import ErrorLogin from '../share/error.login';
import { Link } from "react-router-dom";
import MaterialTable from 'material-table';
import Icon from '@material-ui/core/Icon';
import { API } from '../share/api';
const API_URL = API + 'customers/edit/';
const th = createMuiTheme({
    palette: {
        primary: { main: blue[500] }, // Purple and green play nicely together.
        secondary: { main: '#2196f3' },
        // This is just green.A700 as hex.
    },
});
class DetailCustomer extends Component {
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
            customer_details_id: null,
            customer_swift_code: '',
            user_id: 1,
            redirect: false,
            user_customer: null,
            disable: null,
            message: '',
            columns: [
                { title: 'PO No', field: 'po_number_no', type: 'numberic' },
                { title: 'Description', field: 'po_number_description' },
                { title: 'Status', field: 'status_po_id', lookup: { 1: 'New', 2: 'Active', 3: 'Used' } },
            ],
            data: [
            ],
            dataBill: [],
        }
        this.onChange = this.onChange.bind(this);
        this.cancel = this.cancel.bind(this);
    }
    componentDidMount() {
        Axios.get(API_URL + this.props.match.params.id + "/" + localStorage.getItem('user_id'), { headers: { Authorization: localStorage.getItem('token') } })
            .then(response => {
                if (response.data.status == true) {
                    this.setState({
                        customer_name: response.data.customers.customer_name,
                        customer_email: response.data.customers.customer_email,
                        customer_address: response.data.customers.customer_address,
                        customer_swift_code: response.data.customers.customer_swift_code,
                        customer_number_phone: response.data.customers.customer_number_phone,
                        customer_details_id: response.data.customers.customer_details_id,
                        customer_details_company: response.data.customerDetail.customer_details_company,
                        customer_details_project: response.data.customerDetail.customer_details_project,
                        customer_details_country: response.data.customerDetail.customer_details_country,
                        customer_details_note: response.data.customerDetail.customer_details_note,
                        user_customer: response.data.customer_user.user_id,
                        disable: false,
                        data: response.data.po_nos,
                        dataBill: response.data.bill,
                    });
                }
                else {
                    this.setState({
                        message: 'You do not have permission to edit',
                        disable: true
                    });
                }

            })
            .catch(err => console.log(err));

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
            po_nos: this.state.data,


        };
        Axios.post(API_URL + this.props.match.params.id, customer, { headers: { Authorization: localStorage.getItem('token') } })
            .then(response => {
                this.setState({ redirect: true })
            })
            .catch(err => console.log(err));
    }
    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
        console.log(this.state)
    }
    cancel(e) {
        this.setState({
            redirect: true,
        })
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
                                    <Typography color="textPrimary">Detail</Typography>
                                </Breadcrumbs>
                            </Paper>
                            <Avatar style={{ marginTop: '10px', backgroundColor: '#2196f3', }} >
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5" style={{ marginTop: '10px', marginBottom: '30px' }}>
                                {this.state.customer_name}
                            </Typography>

                            <Grid container spacing={1}>
                                <Grid item xs={2}></Grid>
                                <Grid item xs={4}>
                                <Typography align="right" style={{fontWeight: 'bold'}}>
                                    Name:
                                </Typography>
                                </Grid>
                                <Grid item xs={4} >
                                <Typography align="left">
                                    {this.state.customer_name}
                                </Typography>
                                </Grid>
                                <Grid item xs={2}></Grid>
                                <Grid item xs={2}></Grid>
                                <Grid item xs={4}>
                                <Typography align="right" style={{fontWeight: 'bold'}}>
                                    Email:
                                </Typography>
                                </Grid>
                                <Grid item xs={4} >
                                <Typography align="left">
                                    {this.state.customer_email}
                                </Typography>
                                </Grid>
                                <Grid item xs={2}></Grid>
                                <Grid item xs={2}></Grid>
                                <Grid item xs={4}>
                                <Typography align="right" style={{fontWeight: 'bold'}}>
                                    Address:
                                </Typography>
                                </Grid>
                                <Grid item xs={4} >
                                <Typography align="left">
                                    {this.state.customer_address},{this.state.customer_details_country}
                                </Typography>
                                </Grid>
                                <Grid item xs={2}></Grid>
                                <Grid item xs={2}></Grid>
                                <Grid item xs={4}>
                                <Typography align="right" style={{fontWeight: 'bold'}}>
                                    Company:
                                </Typography>
                                </Grid>
                                <Grid item xs={4} >
                                <Typography align="left">
                                    {this.state.customer_details_company}
                                </Typography>
                                </Grid>
                                <Grid item xs={2}></Grid>
                                <Grid item xs={2}></Grid>
                                <Grid item xs={4}>
                                <Typography align="right" style={{fontWeight: 'bold'}}>
                                    Phone Number:
                                </Typography>
                                </Grid>
                                <Grid item xs={4} >
                                <Typography align="left">
                                    {this.state.customer_number_phone}
                                </Typography>
                                </Grid>
                                <Grid item xs={2}></Grid>
                                <Grid item xs={2}></Grid>
                                <Grid item xs={4}>
                                <Typography align="right" style={{fontWeight: 'bold'}}>
                                    Swift Code:
                                </Typography>
                                </Grid>
                                <Grid item xs={4} >
                                <Typography align="left">
                                    {this.state.customer_swift_code}
                                </Typography>
                                </Grid>
                                <Grid item xs={2}></Grid>
                                <Grid item xs={2}></Grid>
                                <Grid item xs={4}>
                                <Typography align="right" style={{fontWeight: 'bold'}}>
                                    Project:
                                </Typography>
                                </Grid>
                                <Grid item xs={4} >
                                <Typography align="left">
                                    {this.state.customer_details_project}
                                </Typography>
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
                                    <Table className="table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="right">Po No</TableCell>
                                                <TableCell align="right">Description</TableCell>
                                                <TableCell align="right">Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {this.state.data.map(row => (
                                                <TableRow key={row.po_number_no}>
                                                    <TableCell align="right">
                                                        {row.po_number_no}
                                                    </TableCell>
                                                    <TableCell align="right">{row.po_number_description}</TableCell>
                                                    <TableCell align="right">{row.status_po_name}</TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow >
                                                    <TableCell align="right" colSpan={5}>
                                                      <Link to={"/customer-edit/" + this.props.match.params.id}> Edit</Link>
                                                    </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </Grid>
                                <Grid item xs={2}></Grid>
                                <Grid item xs={2}></Grid>
                                <Grid item xs={8}>
                                <Typography align="left" style={{fontWeight: 'bold'}}>
                                   Bills
                                </Typography>
                                </Grid>
                                <Grid item xs={2}></Grid>
                                <Grid item xs={2}></Grid>
                                <Grid item xs={8}>
                                    <Table className="table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="right">Date</TableCell>
                                                <TableCell align="right">Month</TableCell>
                                                <TableCell align="right">PO No</TableCell>
                                                <TableCell align="right">Sum</TableCell>
                                                <TableCell align="right">Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {this.state.dataBill.map(row => (
                                                <TableRow key={row.po_number_no}>
                                                    <TableCell align="right">
                                                        {row.bill_date}
                                                    </TableCell>
                                                    <TableCell align="right">{row.bill_monthly_cost}</TableCell>
                                                    <TableCell align="right">{row.po_number_no}</TableCell>
                                                    <TableCell align="right">{row.bills_sum}</TableCell>
                                                    <TableCell align="right">{row.status_bill_name}</TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow >
                                                    <TableCell align="right" colSpan={5}>
                                                    <Link to={"/bill-list-customer/" + this.props.match.params.id}>All Bill</Link>
                                                    </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </Grid>
                                <Grid item xs={2}></Grid>
                                <Grid item xs={4}></Grid>
                                <Grid item xs={2}>
                                    <Button style={{ marginTop: '20px', color: 'white', backgroundColor: 'red' }}
                                        type="button"
                                        fullWidth
                                        variant="contained"
                                        disabled={this.state.disable}
                                        onClick={this.cancel}
                                    >
                                        Cancel
          </Button>
                                </Grid>
                                <Grid item xs={2}>
                                <Link to={"/customer-edit/" + this.props.match.params.id}>
                                    <Button style={{ marginTop: '20px' }}
                                        type="button"
                                        fullWidth
                                        variant="contained"
                                        color="secondary"
                                        disabled={this.state.disable}
                                    >
                                        Edit
          </Button></Link>
                                </Grid>
                                <Grid item xs={4}></Grid>
                            </Grid>

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
export default connect(mapStateToProps)(DetailCustomer);