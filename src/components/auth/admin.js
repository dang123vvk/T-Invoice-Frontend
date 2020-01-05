import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { ThemeProvider } from '@material-ui/styles';
import { Container, CssBaseline, createMuiTheme, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import ReceiptIcon from '@material-ui/icons/Receipt';
import { blue } from '@material-ui/core/colors';
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import GroupAddIcon from '@material-ui/icons/Group';
import Axios from 'axios';
const th = createMuiTheme({
    palette: {
        primary: { main: blue[500] },
        secondary: { main: '#2196f3' },
    },
});
class AdminDashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isSenior: this.props.isSenior,
            lengthUser: 0,
            lengthGroup: 0,
        };
        this.classes = this.useStyles;
        this.componentDidMount = this.componentDidMount.bind(this);
    }
    componentDidMount() {
        Axios.get('http://localhost:5000/users/length')
            .then(response => {
                this.setState({ lengthUser: response.data.length });
            })
            .catch(err => console.log(err));
        Axios.get('http://localhost:5000/users/groups/length')
            .then(response => {
                //   console.log(JSON.stringify(response.data));
                this.setState({ lengthGroup: response.data.length });
            })
            .catch(err => console.log(err));
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
    }));
    render() {
            return (
                <ThemeProvider theme={th}>
                    <Container component="main" maxWidth="sm">
                        <CssBaseline />
                        <div className="border">
                            <Grid container spacing={5} style={{ marginTop: '30px', marginBottom: '20px' }}>
                                <Grid item xs={12} >
                                    <div className="row">
                                    <div className="col-sm-1"></div>
                                        <div className="col-sm-4" style={{ height: '80px', backgroundColor: '#2196f3'}} >
                                            <div className="row">
                                            <div className="col-sm-2"></div>
                                                <div className="col-sm-4" style={{color: 'white', marginTop: '10px'}}>
                                                    Users
                                                    <br></br>
                                                    <br></br>
                                                    <p style={{fontSize: '24px', fontWeight: 'bold'}}>{this.state.lengthUser}</p>
                                                </div>
                                                <div className="col-sm-4" align="center" style={{marginTop: '15px'}}>
                                                    <AccountBoxIcon style={{ fontSize: '50px', backgroundColor: '#2196f3', color: 'white' }} />
                                                </div>
                                                <div className="col-sm-2"></div>
                                            </div>
                                        </div>
                                        <div className="col-sm-2"></div>
                                        <div className="col-sm-4" style={{ height: '80px', backgroundColor: '#2196f3'}}>
                                        <div className="row">
                                            <div className="col-sm-2"></div>
                                                <div className="col-sm-4" style={{color: 'white', marginTop: '10px'}}>
                                                    Groups
                                                    <br></br>
                                                    <br></br>
                                                    <p style={{fontSize: '24px', fontWeight: 'bold'}}>{this.state.lengthGroup}</p>
                                                </div>
                                                <div className="col-sm-4" align="center" style={{marginTop: '15px'}}>
                                                    <GroupAddIcon style={{ fontSize: '50px', backgroundColor: '#2196f3', color: 'white' }} />
                                                </div>
                                                <div className="col-sm-2"></div>
                                            </div>
                                        </div>
                                        <div className="col-sm-1"></div>
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                        <div className="border">
                            <Grid container spacing={8} style={{ marginTop: '50px', marginBottom: '20px' }}>
                                <Grid item xs={12} md={4} >
                                    <Typography className={this.classes.title} align="center">
                                        <Link to="/user-list"><AccountBoxIcon style={{ fontSize: '100px', backgroundColor: '#2196f3', color: 'white' }} /></Link>
                                    </Typography>
                                    <Typography variant="h6" className={this.classes.title} align="center">
                                       Manage Users
                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={4} >
                                    <Typography className={this.classes.title} align="center">
                                        <Link to="/group-list"><GroupAddIcon style={{ fontSize: '100px', backgroundColor: '#2196f3', color: 'white' }} /></Link>
                                    </Typography>
                                    <Typography variant="h6" className={this.classes.title} align="center">
                                    Manage Groups
                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={4} >
                                    <Typography className={this.classes.title} align="center">
                                        <Link to="/detail-template"><ReceiptIcon style={{ fontSize: '100px', backgroundColor: '#2196f3', color: 'white' }} /></Link>
                                    </Typography>
                                    <Typography variant="h6" className={this.classes.title} align="center">
                                    Manage Template
                    </Typography>
                                </Grid>
                                
                            </Grid>
                            
                                
                            
                        </div>
                    </Container>
                </ThemeProvider>
            );
    }
}
const mapStateToProps = state => {
    return {
        title: state.loginReducer.username,
        isLogin: state.loginReducer.isLogin,
        isAdmin: state.loginReducer.isAdmin,
        isSenior: state.loginReducer.isSenior
    };
}
export default connect(mapStateToProps)(AdminDashboard);