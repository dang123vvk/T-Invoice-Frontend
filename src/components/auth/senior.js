import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { ThemeProvider } from '@material-ui/styles';
import { Container, CssBaseline, createMuiTheme, Paper, Table, TableHead, TableRow, TableCell, TableBody, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails, TextField, FormControl, InputLabel, Select, MenuItem, ExpansionPanelActions, Fab, Divider } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import DashboardIcon from '@material-ui/icons/Dashboard';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ReceiptIcon from '@material-ui/icons/Receipt';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import ErrorAdmin from '../share/error.admin';
import Axios from 'axios';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SearchIcon from '@material-ui/icons/Search';
import { API } from '../share/api';
import  {Redirect}  from 'react-router';
const API_URL = API + 'groups/senior/';
const th = createMuiTheme({
    palette: {
        primary: { main: blue[500] },
        secondary: { main: '#2196f3' },
    },
});
class SeniorDashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isSenior: this.props.isSenior,
            directorNumber: 0,
            customerNumber: 0,
            total: 0,
            billNumber: 0,
            dataBill: [],
            dataCustomer: [],
            expanded: false,
            status_bill_id: 1,
            date_from: '',
            date_to: '',
            redirect: false,
            customer_name: '',
            dataDirector: [],
            director_id: 0,
        };
        this.classes = this.useStyles;
        this.handleChangeStatus = this.handleChangeStatus.bind(this);
        this.handleChangeDirector = this.handleChangeDirector.bind(this);
        this.onChange = this.onChange.bind(this);
        this.search = this.search.bind(this);
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
        Axios.get(API_URL + localStorage.getItem('groups_user_id'),{ headers: { Authorization: localStorage.getItem('token') } })
            .then(response => {
                this.setState({ 
                    directorNumber: response.data.directorNumber,
                    customerNumber: response.data.customerNumber,
                    billNumber: response.data.billNumber,
                    total: response.data.total,
                    dataBill: response.data.dataBill,
                    dataCustomer: response.data.dataCustomer,
                    dataDirector: response.data.dataDirector,
                 });
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
        pa: {
            padding: theme.spacing(3, 2),
        }
    }));
    onChange(e)
    {
      this.setState({
        [e.target.name]: e.target.value,
      });
    }
    handleChange(event, panel1) {
        event.preventDefault();
        if (this.state.expanded == false) {
            this.setState({ expanded: true });
        }
        else {
            this.setState({ expanded: false });

        }

    }
    handleChangeDirector(event) {
        event.preventDefault();
        this.setState({ director_id: event.target.value });


    }
    handleChangeStatus(event) {
        event.preventDefault();
        this.setState({ status_bill_id: event.target.value });


    }
    search(e)
    {
        if(this.state.customer_name == '')
        {
            this.setState({
                customer_name: ' ',
                redirect: true
               })
        }
        else{
            this.setState({
                redirect: true
               })
        }
    }
    render() {
        const  redirect  = this.state.redirect;
        if (redirect) {
          return <Redirect to={'/search-senior/director/'+ this.state.director_id+ '/status/' + this.state.status_bill_id + '/date_from/'+this.state.date_from+ '/date_to/'+ this.state.date_to}/>;
        }
        if((this.props.isSenior == 'true') || (localStorage.getItem('role_id')==3))
        {
        return (
            <ThemeProvider theme={th}>
                <Container component="main" maxWidth="md">
                    <CssBaseline />
                    <div style={{ flexFlow: 1 }}>
                        <Grid container spacing={3} style={{ marginTop: '10px' }}>
                            <Grid item xs >
                                <Paper style={{ height: '80px', textAlign: 'center' }} >
                                    <br />
                                    Number of Director
                            <br />
                                    <Typography variant="h5" className={this.classes.title} align="center">
                                    <Link to="/user-senior" style={{ color: 'black',textDecoration: 'none'}}> {this.state.directorNumber}</Link>
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs >
                                <Paper style={{ height: '80px', textAlign: 'center' }} >
                                    <br />
                                    Number of Customer
                            <br />
                                    <Typography variant="h5" className={this.classes.title} align="center">
                                    <Link to="/customer-senior" style={{ color: 'black',textDecoration: 'none'}}>{this.state.customerNumber}</Link>
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs >
                                <Paper style={{ height: '80px', textAlign: 'center' }}>
                                    <br />
                                    Number of Bill
                            <br />
                                    <Typography variant="h5" className={this.classes.title} align="center">
                                    <Link to="/bill-senior" style={{ color: 'black',textDecoration: 'none'}}>{this.state.billNumber}</Link>
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs >
                                <Paper style={{ height: '80px', textAlign: 'center' }}>
                                    <br />
                                    Total of Bill
                            <br />
                                    <Typography variant="h5" className={this.classes.title} align="center">
                                       $ {this.state.total}
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3} style={{ marginTop: '10px' }}>
                            <Grid item xs >
                                <Paper style={{ height: 'auto', textAlign: 'center' }}>
                                    <ExpansionPanel expanded={this.state.expanded} onChange={(event) => this.handleChange(event, 'panel1')}>
                                        <ExpansionPanelSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1bh-content"
                                            id="panel1bh-header"
                                        >
                                            Filter Bills
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails>

                                            <div style={{ width: '100%' }} className="row">
                                                <div className="col-sm-3">
                                                <FormControl fullWidth >
                                                        <InputLabel htmlFor="name-disabled">Director</InputLabel>
                                                        <Select value={this.state.director_id}
                                                            onChange={event => this.handleChangeDirector(event)}>
                                                            <MenuItem key={0} value={0} >
                                                               All
                                                                </MenuItem>
                                                                {this.state.dataDirector.map(director => (
                                                                <MenuItem key={director.user_id} value={director.user_id} >
                                                                    {director.user_fullname}
                                                                </MenuItem>
                                                                ))}
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                                <div className="col-sm-3">
                                                    <FormControl fullWidth >
                                                        <InputLabel htmlFor="name-disabled">Status</InputLabel>
                                                        <Select value={this.state.status_bill_id}
                                                            onChange={event => this.handleChangeStatus(event)}>
                                                            <MenuItem key={1} value={1} >
                                                                Not Sent
                                                                </MenuItem>
                                                            <MenuItem key={2} value={2} >
                                                                Sent
                                                                </MenuItem>
                                                            <MenuItem key={3} value={3} >
                                                                Paid
                                                                </MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                                <div className="col-sm-3">
                                                    <TextField
                                                        id="date"
                                                        label="From"
                                                        type="date"
                                                        value={this.state.date_from}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        name="date_from"
                                                        onChange={this.onChange}
                                                    />
                                                </div>
                                                <div className="col-sm-3">
                                                    <TextField
                                                        id="date"
                                                        label="To"
                                                        type="date"
                                                        value={this.state.date_to}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        name="date_to"
                                                        onChange={this.onChange}
                                                    />
                                                </div>
                                            </div>
                                        </ExpansionPanelDetails>
                                        <Divider />
                                        <ExpansionPanelActions>
                                            <Fab onClick={this.search}
                                                variant="extended"
                                                size="small"
                                                color="primary"
                                                aria-label="Add"
                                            >
                                                <SearchIcon />
                                                Filter
                                                        </Fab>
                                        </ExpansionPanelActions>
                                    </ExpansionPanel>
                                </Paper>
                            </Grid>
                        </Grid>
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
                                            <TableRow>
                                                <TableCell align="left" >{row.bill_date}</TableCell>
                                                <TableCell align="left"> {row.customer_name}</TableCell>
                                                <TableCell align="left" >{row.user_fullname}</TableCell>
                                                <TableCell align="left"> {row.bills_sum}</TableCell>
                                                <TableCell align="left" >{row.status_bill_name}</TableCell>
                                            </TableRow>
                                            ))}
                                            <TableRow>
                                                <TableCell align="right" colSpan={5} ><Link to="/bill-senior">View all </Link></TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </Paper>
                            </Grid>
                            </Grid>
                            <Grid container spacing={3} style={{ marginTop: '10px' }}>
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
                                            <TableRow>
                                                <TableCell align="left" >{row.customer_name}</TableCell>
                                                <TableCell align="left"> {row.customer_details_company}</TableCell>
                                                <TableCell align="left" >{row.customer_details_country}</TableCell>
                                                <TableCell align="left" >{row.user_fullname}</TableCell>

                                            </TableRow>
                                            ))}
                                            <TableRow>
                                                <TableCell align="right" colSpan={4} ><Link to="/customer-senior">View all </Link></TableCell>
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
                                        <Link to="/dashboard"><DashboardIcon style={{ fontSize: '50px', backgroundColor: '#2196f3', color: 'white' }} /></Link>
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
                                        <Link to="/user-senior"><GroupWorkIcon style={{ fontSize: '50px', backgroundColor: '#2196f3', color: 'white' }} /></Link>
                                    </Typography>
                                    <Typography variant="caption" className={this.classes.title} align="center">
                                        Director
                        </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs >
                                <Paper style={{ height: '100px', textAlign: 'center' }}>
                                    <br />
                                    <Typography align="center">
                                        <Link to="/customer-senior"><SupervisorAccountIcon style={{ fontSize: '50px', backgroundColor: '#2196f3', color: 'white' }} /></Link>
                                    </Typography>
                                    <Typography variant="caption" className={this.classes.title} align="center">
                                        Customer
                             </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs hidden={!(this.props.isSenior)} >
                                <Paper style={{ height: '100px', textAlign: 'center' }}>
                                    <br />
                                    <Typography align="center">
                                        <Link to="/bill-senior"><ReceiptIcon  style={{ fontSize: '50px', backgroundColor: '#2196f3', color: 'white' }} /></Link>
                                    </Typography>
                                    <Typography variant="caption" className={this.classes.title} align="center">
                                        Bill
                            </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs >
                                <Paper style={{ height: '100px', textAlign: 'center' }}>
                                    <br />
                                    <Typography align="center">
                                        <Link to="/profile"><AccountCircleIcon style={{ fontSize: '50px', backgroundColor: '#2196f3', color: 'white' }} /></Link>
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
     return (
         <ErrorAdmin />
     );
    }
}
const mapStateToProps = state => {
    return {
        title: state.loginReducer.username,
        isLogin: state.loginReducer.isLogin,
        isAdmin: state.loginReducer.isAdmin,
        isSenior: state.loginReducer.isSenior,
        token: state.loginReducer.token,
    };
}
export default connect(mapStateToProps)(SeniorDashboard);