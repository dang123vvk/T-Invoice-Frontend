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
import { FormControl, Paper, Breadcrumbs, Table, TableHead, TableCell, TableBody, TableRow, Fab, makeStyles, Divider } from '@material-ui/core';
import { Redirect } from 'react-router'
import { connect } from "react-redux";
import NotFound from '../views/NotFound';
import { Link } from "react-router-dom";
import Icon from '@material-ui/core/Icon';
import { getCustomerEdit } from '../share/services/customer.service';
import { th } from "../share/config";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';


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
            data: [],
            dataBill: [],
            expanded1: false,
            expanded2: true,
            expanded3: true
        }
        this.onChange = this.onChange.bind(this);
        this.cancel = this.cancel.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeExpan2 = this.handleChangeExpan2.bind(this);
        this.handleChangeExpan3 = this.handleChangeExpan3.bind(this);
        this.classes = this.useStyles;
        document.title = 'Detail Customer';
    }
    UNSAFE_componentWillMount() {
        getCustomerEdit(this.props.match.params.id, this.props.token).then(data => {
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
    }
    useStyles = makeStyles(theme => ({
        root: {
            width: '100%',
        },
        heading: {
            fontSize: theme.typography.pxToRem(15),
            flexBasis: '33.33%',
            flexShrink: 0,
        },
        secondaryHeading: {
            fontSize: theme.typography.pxToRem(15),
            color: theme.palette.text.secondary,
        },
    }));
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
    handleChange(event, panel) {
        event.preventDefault();
        if (this.state.expanded1 == false) {
            this.setState({ expanded1: true });
        }
        else {
            this.setState({ expanded1: false });
        }
    }

    handleChangeExpan2(event, panel) {
        event.preventDefault();
        if (this.state.expanded2 == false) {
            this.setState({ expanded2: true });
        }
        else {
            this.setState({ expanded2: false });
        }
    }
    handleChangeExpan3(event, panel) {
        event.preventDefault();
        if (this.state.expanded3 == false) {
            this.setState({ expanded3: true });
        }
        else {
            this.setState({ expanded3: false });
        }
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
                                    <Link style={{ color: '#3f51b5' }} to="/customers" >
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
                            <ExpansionPanel expanded={this.state.expanded1} onChange={(event) => this.handleChange(event, 'panel1')}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    style={{ fontWeight: 'bold' }}
                                >
                                    <Typography className={this.classes.heading}> Detail information</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6}>
                                            <Typography align="right" style={{ fontWeight: 'bold' }}>
                                                Name:
                                </Typography>
                                        </Grid>
                                        <Grid item xs={6} >
                                            <Typography align="left">
                                                {this.state.customer_name}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography align="right" style={{ fontWeight: 'bold' }}>
                                                Email:
                                </Typography>
                                        </Grid>
                                        <Grid item xs={6} >
                                            <Typography align="left">
                                                {this.state.customer_email}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={6}>
                                            <Typography align="right" style={{ fontWeight: 'bold' }}>
                                                Address:
                                </Typography>
                                        </Grid>
                                        <Grid item xs={6} >
                                            <Typography align="left">
                                                {this.state.customer_address},{this.state.customer_details_country}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography align="right" style={{ fontWeight: 'bold' }}>
                                                Company:
                                </Typography>
                                        </Grid>
                                        <Grid item xs={6} >
                                            <Typography align="left">
                                                {this.state.customer_details_company}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography align="right" style={{ fontWeight: 'bold' }}>
                                                Phone Number:
                                </Typography>
                                        </Grid>
                                        <Grid item xs={6} >
                                            <Typography align="left">
                                                {this.state.customer_number_phone}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography align="right" style={{ fontWeight: 'bold' }}>
                                                Swift Code:
                                </Typography>
                                        </Grid>
                                        <Grid item xs={6} >
                                            <Typography align="left">
                                                {this.state.customer_swift_code}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography align="right" style={{ fontWeight: 'bold' }}>
                                                Project:
                                </Typography>
                                        </Grid>
                                        <Grid item xs={6} >
                                            <Typography align="left">
                                                {this.state.customer_details_project}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <Divider />
                            <Grid container spacing={1}>
                            <Grid item xs={12} > 
                            <ExpansionPanel expanded={this.state.expanded2} onChange={(event) => this.handleChangeExpan2(event, 'panel1')}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    style={{ fontWeight: 'bold' }}
                                >
                                    <Typography className={this.classes.heading}>PO NOs</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                
                       
                                    <Table className="table" style={{ width: '100%' }}>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="right">Po No</TableCell>
                                                <TableCell align="right">Amount</TableCell>
                                                <TableCell align="right">Used Amount</TableCell>
                                                <TableCell align="right">Remaining Amount</TableCell>
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
                                                    <TableCell align="right"></TableCell>
                                                    <TableCell align="right"></TableCell>
                                                    <TableCell align="right"></TableCell>
                                                    <TableCell align="right">{row.status_po_name}</TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow >
                                                <TableCell align="right" colSpan={7}>
                                                    <Link style={{ color: '#3f51b5' }} to={"/customers/edit/" + this.props.match.params.id}> Edit</Link>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>

                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            </Grid>
                            </Grid>
                            <Divider />
                            <Grid container spacing={1}>
                            <Grid item xs={12} >
                            <ExpansionPanel expanded={this.state.expanded3} onChange={(event) => this.handleChangeExpan3(event, 'panel1')}>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    style={{ fontWeight: 'bold' }}
                                >
                                    <Typography className={this.classes.heading}>Bills</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
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
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            </Grid>
                            </Grid>
                            <Grid container spacing={1}>
                            <Grid item xs={4} ></Grid>
                            <Grid item xs={2} className='d-flex justify-content-end' >
                            <Button style={{ marginTop: '20px', color: 'white', backgroundColor: 'red' }}
                                type="button"
                                variant="contained"
                                disabled={this.state.disable}
                                onClick={this.cancel}>Cancel</Button>
                                </Grid>
                                <Grid item xs={2}   >
                            <Link to={"/customers/edit/" + this.props.match.params.id} style={{ textDecoration: 'none'}}>
                                <Button style={{ marginTop: '20px' }}
                                    type="button"
                                    variant="contained"
                                    color="primary"
                                    disabled={this.state.disable}
                                > Edit</Button></Link>
                                </Grid>
                                <Grid item xs={4} ></Grid>
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
        token: state.loginReducer.token
    };
}
export default connect(mapStateToProps)(DetailCustomer);