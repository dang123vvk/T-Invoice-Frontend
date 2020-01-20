import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { ThemeProvider } from '@material-ui/styles';
import { Container, CssBaseline, Paper, Table, TableHead, TableRow, TableCell, TableBody} from '@material-ui/core';
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import ReceiptIcon from '@material-ui/icons/Receipt';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import { getCustomerSearch } from '../share/services/customer.service';
import {  th} from "../share/config";
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { getDashboardSenior } from "../share/services/group.service";
import NotFound from "../views/NotFound";

class SeniorDashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isSenior: this.props.isSenior,
            billNumber: 0,
            customerNumber: 0,
            total: 0,
            billNotSent: 0,
            dataBill: [],
            dataCustomer: [],
            expanded: false,
            status_bill_id: 1,
            date_from: '',
            date_to: '',
            redirect: false,
            customer_name: '',
            customer_id: 1,
            dataCustomersSearch: [],
            isSenior: false,
            directorNumber: 0,
            dataDirector: []

        };
        this.classes = this.useStyles;
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeStatus = this.handleChangeStatus.bind(this);
        this.onChange = this.onChange.bind(this);
        this.search = this.search.bind(this);
        this.selectCustomer = this.selectCustomer.bind(this);
        this.onChangeSearchCustomer = this.onChangeSearchCustomer.bind(this);
        document.title = 'Dashboard Senior';
    }
    componentDidMount() {
        var date = new Date().getDate();
        var month1 = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        if (month1 < 10) month1 = "0" + month1;
        if (date < 10) date = "0" + date;
        this.setState({
            date_from: year + '-' + month1 + '-' + date,
            date_to: year + '-' + month1 + '-' + date,
        });
        getDashboardSenior(this.props.group, this.props.role, this.props.token).then(data => {
            this.setState({ 
                directorNumber: data.directorNumber,
                customerNumber: data.customerNumber,
                billNumber: data.billNumber,
                total: data.total,
                dataBill: data.dataBill,
                dataCustomer: data.dataCustomer,
                dataDirector: data.dataDirector,
             })  
        })
    }
    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    onChangeSearchCustomer(e) {
        getCustomerSearch(e.target.value, this.props.user_username, this.props.token).then(data=>{
            this.setState({
                dataCustomersSearch: data.customers
            });
        })
        this.setState({
            [e.target.name]: e.target.value
        });     
    }
    useStyles = makeStyles(theme => ({
        root: {
            marginTop: theme.spacing(8),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        paper: {
            marginTop: theme.spacing(8),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        demo: {
            backgroundColor: theme.palette.background.paper,
        },
        title: {
            margin: theme.spacing(4, 0, 2),
        },
        pa: {
            padding: theme.spacing(3, 2),
        }
    }));
    handleChange(event, panel1) {
        event.preventDefault();
        if (this.state.expanded == false) {
            this.setState({ expanded: true });
        }
        else {
            this.setState({ expanded: false });

        }

    }
    handleChangeStatus(event) {
        event.preventDefault();
        this.setState({ status_bill_id: event.target.value });


    }
    search(e) {
        e.preventDefault();
        this.setState({
            redirect: true
           })
    }
    selectCustomer(e, customer_name, customer_id) {
        e.preventDefault();
        this.setState({
            customer_name: customer_name,
            dataCustomersSearch: [],
            customer_id: customer_id,
        })
    }
    render() {
        const redirect = this.state.redirect;
        if (redirect) {
            return <Redirect to={'bills/search/customer/'+ this.state.customer_id+ '/status/' + this.state.status_bill_id + '/date_from/'+this.state.date_from+ '/date_to/'+ this.state.date_to}/>;
          }
          if ((this.props.role === 'Sr.Director') && (localStorage.getItem('user_information'))) {
        return (
            <ThemeProvider theme={th}>
                <Container component="main" maxWidth="md">
                    <CssBaseline />
                    <div style={{ flexFlow: 1 }}>
                        <Grid container spacing={3} style={{ marginTop: '10px' }}>
                            <Grid item xs >
                                <Paper style={{ height: 'auto', textAlign: 'center' }}>
                                    <br />
                                    Recent Bills
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="left" >Date</TableCell>
                                                <TableCell align="left" >Customer</TableCell>
                                                <TableCell align="left" >Director</TableCell>
                                                <TableCell align="left" >Total</TableCell>
                                                <TableCell align="left" >Status</TableCell>

                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {this.state.dataBill.map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell align="left" >{row.bill_date}</TableCell>
                                                <TableCell align="left"> {row.customer_name}</TableCell>
                                                <TableCell align="left" >{row.user_fullname}</TableCell>
                                                <TableCell align="left"> {row.bills_sum}</TableCell>
                                                <TableCell align="left" >{row.status_bill_name}</TableCell>
                                            </TableRow>
                                            ))}
                                            <TableRow>
                                                <TableCell align="right" colSpan={5} ><Link style={{ color: '#3f51b5' }} to="/senior/bills">View all </Link></TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </Paper>
                            </Grid>
                            <Grid item xs >
                                <Paper style={{ height: 'auto', textAlign: 'center' }}>
                                    <br />
                                    New Customer
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="left" >Name</TableCell>
                                                <TableCell align="left" >Company</TableCell>
                                                <TableCell align="left" >Country</TableCell>
                                                <TableCell align="left" >Director</TableCell>

                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                        {this.state.dataCustomer.map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell align="left" >{row.customer_name}</TableCell>
                                                <TableCell align="left"> {row.customer_details_company}</TableCell>
                                                <TableCell align="left" >{row.customer_details_country}</TableCell>
                                                <TableCell align="left" >{row.user_fullname}</TableCell>

                                            </TableRow>
                                            ))}
                                            <TableRow>
                                                <TableCell align="right" colSpan={4} ><Link  style={{ color: '#3f51b5' }} to="/senior/customers">View all </Link></TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </Paper>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs >
                                <Paper style={{ height: '100px', textAlign: 'center' }}>
                                    <br />
                                    <Typography align="center">
                                        <Link to="/"><DashboardIcon style={{ fontSize: '50px' }} color='primary' /></Link>
                                    </Typography>
                                    <Typography variant="caption" className={this.classes.title} align="center">
                                        Dashboard
                            </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs >
                                <Paper style={{ height: '100px', textAlign: 'center' }}>
                                    <br />
                                    <Typography align="center">
                                        <Link to="/senior/directors"><GroupWorkIcon style={{ fontSize: '50px' }} color='primary' /></Link>
                                    </Typography>
                                    <Typography variant="caption" className={this.classes.title} align="center">
                                        Directors
                        </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs >
                                <Paper style={{ height: '100px', textAlign: 'center' }}>
                                    <br />
                                    <Typography align="center">
                                        <Link to="/senior/customers"><SupervisorAccountIcon style={{ fontSize: '50px' }} color='primary' /></Link>
                                    </Typography>
                                    <Typography variant="caption" className={this.classes.title} align="center">
                                        Customers
                             </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs hidden={!this.state.isSenior}>
                                <Paper style={{ height: '100px', textAlign: 'center' }}>
                                    <br />
                                    <Typography align="center">
                                        <Link to="/senior/bills"><ReceiptIcon style={{ fontSize: '50px' }} color='primary' /></Link>
                                    </Typography>
                                    <Typography variant="caption" className={this.classes.title} align="center">
                                       Bills
                            </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs >
                                <Paper style={{ height: '100px', textAlign: 'center' }}>
                                    <br />
                                    <Typography align="center">
                                        <Link to="/profile"><AccountBoxIcon style={{ fontSize: '50px' }} color='primary' /></Link>
                                    </Typography>
                                    <Typography variant="caption" className={this.classes.title} align="center">
                                        My Account
                            </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </div>
                </Container>
            </ThemeProvider>
        );
    }
    return( <NotFound />)
 
}
}
const mapStateToProps = (state) => {
    return {
        user_fullname: state.loginReducer.user_fullname,
        user_username: state.loginReducer.user_username,
        role: state.loginReducer.role,
        token: state.loginReducer.token,
        group: state.loginReducer.group
    };
}
export default connect(mapStateToProps)(SeniorDashboard);