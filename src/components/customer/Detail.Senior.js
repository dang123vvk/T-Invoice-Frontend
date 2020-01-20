import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/AccountCircleSharp';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { ThemeProvider } from '@material-ui/styles';
import { Paper, Breadcrumbs, Table, TableHead, TableCell, TableBody, TableRow } from '@material-ui/core';
import { Redirect } from 'react-router'
import { connect } from "react-redux";
import NotFound from '../views/NotFound';
import { Link } from "react-router-dom";
import { getCustomerEditSenior } from '../share/services/customer.service';
import { th } from "../share/config";

class DetailCustomerSenior extends Component {
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
            data: [],
            dataBill: [],
        }
        this.cancel = this.cancel.bind(this);
        document.title = 'Detail Customer';
    }
    UNSAFE_componentWillMount() {
        getCustomerEditSenior(this.props.match.params.id, this.props.group, this.props.role, this.props.token).then(data => {
            this.setState({
                customer_name: data.customers.customer_name,
                customer_email: data.customers.customer_email,
                customer_address: data.customers.customer_address,
                customer_number_phone: data.customers.customer_number_phone,
                customer_details_company: data.customerDetail.customer_details_company,
                customer_details_project: data.customerDetail.customer_details_project,
                customer_details_country: data.customerDetail.customer_details_country,
                customer_details_note: data.customerDetail.customer_details_note,
                customer_swift_code: data.customers.customer_swift_code,
                data: data.po_nos,
                dataBill: data.bill
            })
        })
    }
    cancel(e) {
        this.setState({
            redirect: true,
        })
    }
    render() {
        const redirect = this.state.redirect;
        if (redirect) {
            return <Redirect to='/customers' />;
        }
        if (((this.props.role === 'Director') && (localStorage.getItem('user_information'))) || ((this.props.role === 'Sr.Director') && (localStorage.getItem('user_information')))) {
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
                                    <Link style={{ color: '#3f51b5' }} to="/senior" >
                                        Senior
                                    </Link>
                                    <Link style={{ color: '#3f51b5' }} to="/senior/customers" >
                                        Customers
                                    </Link>
                                    <Typography color="textPrimary">Detail</Typography>
                                </Breadcrumbs>
                            </Paper>
                            <Avatar style={{ marginTop: '10px', backgroundColor: '#3f51b5', }} >
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5" style={{ marginTop: '10px', marginBottom: '30px' }}>
                                {this.state.customer_name}
                            </Typography>

                            <Grid container spacing={1}>
                                <Grid item xs={2}></Grid>
                                <Grid item xs={4}>
                                    <Typography align="right" style={{ fontWeight: 'bold' }}>
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
                                    <Typography align="right" style={{ fontWeight: 'bold' }}>
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
                                    <Typography align="right" style={{ fontWeight: 'bold' }}>
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
                                    <Typography align="right" style={{ fontWeight: 'bold' }}>
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
                                    <Typography align="right" style={{ fontWeight: 'bold' }}>
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
                                    <Typography align="right" style={{ fontWeight: 'bold' }}>
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
                                    <Typography align="right" style={{ fontWeight: 'bold' }}>
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
                                    <Typography align="left" style={{ fontWeight: 'bold' }}>
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
                                        </TableBody>
                                    </Table>
                                </Grid>
                                <Grid item xs={2}></Grid>
                                <Grid item xs={2}></Grid>
                                <Grid item xs={8}>
                                    <Typography align="left" style={{ fontWeight: 'bold' }}>
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
                                        </TableBody>
                                    </Table>
                                </Grid>
                                <Grid item xs={2}></Grid>
                                <Grid item xs={5}></Grid>
                                <Grid item xs={2}>
                                    <Link to={"/senior/customers"}>
                                        <Button style={{ marginTop: '20px' }}
                                            type="button"
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                        >
                                            Back
                                        </Button>
                                    </Link>
                                </Grid>
                                <Grid item xs={5}></Grid>
                            </Grid>
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
        token: state.loginReducer.token,
        group: state.loginReducer.group
    };
}
export default connect(mapStateToProps)(DetailCustomerSenior);