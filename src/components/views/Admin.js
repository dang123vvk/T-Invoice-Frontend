import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { ThemeProvider } from '@material-ui/styles';
import { Container, CssBaseline, Paper } from '@material-ui/core';
import { Link  } from "react-router-dom";
import { connect } from "react-redux";
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import { getCustomerSearch } from '../share/services/customer.service';
import { th } from "../share/config";
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import { getDashboardSenior } from "../share/services/group.service";
import NotFound from "./NotFound";

class AdminDashboard extends Component {
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
        document.title = 'Admin Dashboard';
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
        getCustomerSearch(e.target.value, this.props.user_username, this.props.token).then(data => {
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
        if ((this.props.role === 'Admin') && (localStorage.getItem('user_information'))) {
            return (
                <ThemeProvider theme={th}>
                    <Container component="main" maxWidth="md">
                        <CssBaseline />
                        <div style={{ flexFlow: 1 }}>
                            <Grid container spacing={3} style={{ marginTop: '10px' }}>
                                <Grid item xs >
                                    <Paper style={{ height: '80px', textAlign: 'center' }} >
                                        <br />
                                        Users
                            <br />
                                        <Typography variant="h5" className={this.classes.title} align="center">
                                            <Link to="/admin/users" style={{ color: 'black', textDecoration: 'none' }}> {this.state.directorNumber}</Link>
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs >
                                    <Paper style={{ height: '80px', textAlign: 'center' }} >
                                        <br />
                                        Groups
                            <br />
                                        <Typography variant="h5" className={this.classes.title} align="center">
                                            <Link to="/admin/groups" style={{ color: 'black', textDecoration: 'none' }}> {this.state.customerNumber}</Link>
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                            <Grid container spacing={3}>
                                <Grid item xs >
                                    <Paper style={{ height: '100px', textAlign: 'center' }}>
                                        <br />
                                        <Typography align="center">
                                            <Link to="/admin/users"><SupervisorAccountIcon style={{ fontSize: '50px' }} color='primary' /></Link>
                                        </Typography>
                                        <Typography variant="caption" className={this.classes.title} align="center">
                                            Users
                            </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs >
                                    <Paper style={{ height: '100px', textAlign: 'center' }}>
                                        <br />
                                        <Typography align="center">
                                            <Link to="/admin/groups"><GroupWorkIcon style={{ fontSize: '50px' }} color='primary' /></Link>
                                        </Typography>
                                        <Typography variant="caption" className={this.classes.title} align="center">
                                            Groups
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
        return (<NotFound />)

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
export default connect(mapStateToProps)(AdminDashboard);