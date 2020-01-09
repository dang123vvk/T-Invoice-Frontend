import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { ThemeProvider } from '@material-ui/styles';
import { Container, CssBaseline, createMuiTheme, Paper, Table, TableHead, TableRow, TableCell, TableBody, TextField, MenuItem, FormControl, Select, InputLabel, Fab, List, ListItem, ListItemText } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import ReceiptIcon from '@material-ui/icons/Receipt';
import SearchIcon from '@material-ui/icons/Search';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Divider from '@material-ui/core/Divider';
import { getBillLength, getBillSum, getBillNotSendLength, getBillLimit, getBillUserCurrentFilter } from '../share/services/bill.service';
import { getCustomerLength, getCustomerLimit, getCustomerSearch } from '../share/services/customer.service';
const th = createMuiTheme({
    palette: {
        primary: { main: blue[500] },
        secondary: { main: '#2196f3' },
    },
});
class Dashboard extends Component {
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
            dataCustomersSearch: []
        };
        this.classes = this.useStyles;
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeStatus = this.handleChangeStatus.bind(this);
        this.onChange = this.onChange.bind(this);
        this.search = this.search.bind(this);
        this.selectCustomer = this.selectCustomer.bind(this);
        this.onChangeSearchCustomer = this.onChangeSearchCustomer.bind(this);
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
        getBillLength(this.props.token).then(data => {
            this.setState({ billNumber: data.length });
        })
        getBillSum(this.props.token).then(data => {
            this.setState({ total: data.total });
        })
        getCustomerLength(this.props.token).then(data => {
            this.setState({ customerNumber: data.length });
        })
        getBillNotSendLength(this.props.token).then(data => {
            this.setState({ billNotSent: data.length });
        })
        getBillLimit(this.props.token).then(data => {
            this.setState({ dataBill: data.bill });
        })
        getCustomerLimit(this.props.token).then(data => {
            this.setState({ dataCustomer: data.customers });
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
        return (
            <ThemeProvider theme={th}>
                <Container component="main" maxWidth="md">
                    <CssBaseline />
                    <div style={{ flexFlow: 1 }}>
                        <Grid container spacing={3} style={{ marginTop: '10px' }}>
                            <Grid item xs >
                                <Paper style={{ height: '80px', textAlign: 'center' }} >
                                    <br />
                                    Number of Bills
                            <br />
                                    <Typography variant="h5" className={this.classes.title} align="center">
                                        <Link to="/bills" style={{ color: 'black', textDecoration: 'none' }}> {this.state.billNumber}</Link>
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs >
                                <Paper style={{ height: '80px', textAlign: 'center' }} >
                                    <br />
                                    Total Bills
                            <br />
                                    <Typography variant="h5" className={this.classes.title} align="center">
                                        $ {this.state.total}
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs >
                                <Paper style={{ height: '80px', textAlign: 'center' }}>
                                    <br />
                                    Number of Customers
                            <br />
                                    <Typography variant="h5" className={this.classes.title} align="center">
                                        <Link to="/customers" style={{ color: 'black', textDecoration: 'none' }}>{this.state.customerNumber}</Link>
                                    </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs >
                                <Paper style={{ height: '80px', textAlign: 'center' }}>
                                    <br />
                                    Not Sent
                            <br />
                                    <Typography variant="h5" className={this.classes.title} align="center">
                                        <Link to="/bill-list-not-sent" style={{ color: 'black', textDecoration: 'none' }}>{this.state.billNotSent}</Link>
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
                                                    <TextField
                                                        id="outlined-dense"
                                                        label="Customer Name"
                                                        margin="dense"
                                                        variant="outlined"
                                                        name="customer_name"
                                                        value={this.state.customer_name}
                                                        onChange={this.onChangeSearchCustomer}
                                                        autoComplete='off'
                                                    />
                                                    <List component="nav" aria-label="secondary mailbox folder" >
                                                        {
                                                            this.state.dataCustomersSearch.map((customer) => (
                                                                <ListItem key={customer.customer_name}
                                                                    button
                                                                    onClick={event => this.selectCustomer(event,customer.customer_name, customer.customer_id)}
                                                                >
                                                                    <ListItemText primary={customer.customer_name} />
                                                                </ListItem>
                                                            ))

                                                        }
                                                    </List>
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
                                    Current Activity
                            <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="center" >Customer</TableCell>
                                                <TableCell align="center" >Total</TableCell>
                                                <TableCell align="center" >Status</TableCell>

                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {this.state.dataBill.map((row, index) => (
                                                <TableRow key={index}>
                                                    <TableCell align="right" >{row.customer_name}</TableCell>
                                                    <TableCell align="right"> {row.bills_sum}</TableCell>
                                                    <TableCell align="center" >{row.status_bill_name}</TableCell>

                                                </TableRow>
                                            ))}
                                            <TableRow>
                                                <TableCell align="right" colSpan={3} ><Link to="/bills">View all </Link></TableCell>
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
                                                <TableCell align="center" >Name</TableCell>
                                                <TableCell align="center" >Company</TableCell>
                                                <TableCell align="center" >Address</TableCell>

                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {this.state.dataCustomer.map((row, index) => (
                                                <TableRow key={index}>
                                                    <TableCell align="right" >{row.customer_name}</TableCell>
                                                    <TableCell align="right"> {row.customer_details_company}</TableCell>
                                                    <TableCell align="center" >{row.customer_address}</TableCell>

                                                </TableRow>
                                            ))}
                                            <TableRow>
                                                <TableCell align="right" colSpan={3} ><Link to="/customers">View all </Link></TableCell>
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
                                        <Link to="/customers"><SupervisorAccountIcon style={{ fontSize: '50px', backgroundColor: '#2196f3', color: 'white' }} /></Link>
                                    </Typography>
                                    <Typography variant="caption" className={this.classes.title} align="center">
                                        Customer
                            </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs >
                                <Paper style={{ height: '100px', textAlign: 'center' }}>
                                    <br />
                                    <Typography align="center">
                                        <Link to="/accountbanks"><AccountBalanceIcon style={{ fontSize: '50px', backgroundColor: '#2196f3', color: 'white' }} /></Link>
                                    </Typography>
                                    <Typography variant="caption" className={this.classes.title} align="center">
                                        Account Bank
                        </Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs >
                                <Paper style={{ height: '100px', textAlign: 'center' }}>
                                    <br />
                                    <Typography align="center">
                                        <Link to="/bills"><ReceiptIcon style={{ fontSize: '50px', backgroundColor: '#2196f3', color: 'white' }} /></Link>
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
                                        <Link to="/profile"><AccountBoxIcon style={{ fontSize: '50px', backgroundColor: '#2196f3', color: 'white' }} /></Link>
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
}
const mapStateToProps = (state) => {
    return {
        user_fullname: state.loginReducer.user_fullname,
        user_username: state.loginReducer.user_username,
        role: state.loginReducer.role,
        token: state.loginReducer.token
    };
}
export default connect(mapStateToProps)(Dashboard);