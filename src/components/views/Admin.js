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
import {  getDashboardAdmin } from "../share/services/group.service";
import NotFound from "./NotFound";

class AdminDashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isSenior: this.props.isSenior,
            users: 0,
            groups: 0

        };
        this.classes = this.useStyles;
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
        getDashboardAdmin(this.props.role, this.props.token).then(data => {
            console.log(data);
            
            this.setState({
                users: data.users,
                groups: data.groups
            })
        })
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
                                            <Link to="/admin/users" style={{ color: 'black', textDecoration: 'none' }}> {this.state.users}</Link>
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs >
                                    <Paper style={{ height: '80px', textAlign: 'center' }} >
                                        <br />
                                        Groups
                            <br />
                                        <Typography variant="h5" className={this.classes.title} align="center">
                                            <Link to="/admin/groups" style={{ color: 'black', textDecoration: 'none' }}> {this.state.groups}</Link>
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