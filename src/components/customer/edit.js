import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/AccountCircleSharp';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import blue from '@material-ui/core/colors/blue';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { FormControl, Paper, Breadcrumbs, TableSortLabel, Tooltip, Fab, Dialog, DialogContent, DialogActions, DialogTitle } from '@material-ui/core';
import { Redirect } from 'react-router'
import { connect } from "react-redux";
import Axios from 'axios';
import ErrorLogin from '../share/error.login';
import { Link } from "react-router-dom";
import MaterialTable from 'material-table';
import EditIcon from '@material-ui/icons/Edit';
import { API } from '../share/api';
const API_URL = API + 'customers/edit/';
const API_URL_PO = API + 'customers/po_no/'
const API_URL_ADD_PO = API + 'customers/add_po_no/'
const th = createMuiTheme({
    palette: {
        primary: { main: blue[500] }, // Purple and green play nicely together.
        secondary: { main: '#2196f3' },
        // This is just green.A700 as hex.
    },
});
class EditCustomer extends Component {
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
                { title: 'id', field: 'po_number_id', type: 'numeric', hidden: true },
                { title: 'PO No', field: 'po_number_no', type: 'numeric' },
                { title: 'Description', field: 'po_number_description' },
                { title: 'Status', field: 'status_po_id', lookup: { 1: 'New', 2: 'Active', 3: 'Used' } },
            ],
            data: [
            ],
            edit: false
        }
        this.onChange = this.onChange.bind(this);
        this.cancel = this.cancel.bind(this);
        this.openEdit = this.openEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
    }
    componentDidMount() {
        Axios.get(API_URL + this.props.match.params.id + "/" + localStorage.getItem('user_id'), { headers: { Authorization: localStorage.getItem('token') } })
            .then(response => {
                if (response.data.status == true) {
                    this.setState({
                        customer_name: response.data.customers.customer_name,
                        customer_email: response.data.customers.customer_email,
                        customer_address: response.data.customers.customer_address,
                        customer_number_phone: response.data.customers.customer_number_phone,
                        customer_details_id: response.data.customers.customer_details_id,
                        customer_details_company: response.data.customerDetail.customer_details_company,
                        customer_details_project: response.data.customerDetail.customer_details_project,
                        customer_details_country: response.data.customerDetail.customer_details_country,
                        customer_details_note: response.data.customerDetail.customer_details_note,
                        customer_swift_code: response.data.customers.customer_swift_code,
                        user_customer: response.data.customer_user.user_id,
                        disable: false,
                        data: response.data.po_nos,
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
            customer_swift_code: this.state.customer_swift_code,
            po_nos: this.state.data,
        };
        console.log(this.state.data);
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
    openEdit(e) {
        e.preventDefault();
        this.setState({
            edit: true
        })
    }
    closeEdit(e) {
        e.preventDefault();
        this.setState({
            edit: false
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
                                    <Typography color="textPrimary">Edit customer</Typography>
                                </Breadcrumbs>
                            </Paper>
                            <Avatar style={{ marginTop: '10px', backgroundColor: '#2196f3', }} >
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5" style={{ marginTop: '10px', marginBottom: '30px' }}>
                                Edit {this.state.customer_name}
                            </Typography>
                            <Typography style={{ color: 'red' }}>
                                {this.state.message}
                            </Typography>
                            <form validate="true" onSubmit={event => this.handleSubmitForm(event)}>
                                <Grid container spacing={1}>
                                    <Grid item xs={2}></Grid>
                                    <Grid item xs={4}>
                                        <FormControl fullWidth={true}>
                                            <TextField
                                                autoComplete="fname"
                                                name="customer_name"
                                                required
                                                margin="dense"
                                                fullWidth
                                                id="customer_name"
                                                autoFocus
                                                label="Name"
                                                value={this.state.customer_name}
                                                onChange={this.onChange}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={4} >
                                        <FormControl fullWidth={true}>
                                            <TextField
                                                required
                                                fullWidth
                                                id="customer_email"
                                                label="Email"
                                                margin="dense"
                                                name="customer_email"
                                                type="email"
                                                value={this.state.customer_email}
                                                onChange={this.onChange}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={2}></Grid>
                                    <Grid item xs={2}></Grid>
                                    <Grid item xs={4} >
                                        <FormControl fullWidth={true}>
                                            <TextField
                                                required
                                                fullWidth
                                                id="customer_address"
                                                label="Address"
                                                margin="dense"
                                                name="customer_address"
                                                value={this.state.customer_address}
                                                onChange={this.onChange}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControl fullWidth={true}>
                                            <TextField
                                                required
                                                fullWidth
                                                margin="dense"
                                                id="customer_number_phone"
                                                label="Phone Number"
                                                value={this.state.customer_number_phone}
                                                name="customer_number_phone"
                                                onChange={this.onChange}
                                                type="number"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={2}></Grid>
                                    <Grid item xs={2}></Grid>
                                    <Grid item xs={4} >
                                        <FormControl fullWidth={true}>
                                            <TextField
                                                required
                                                fullWidth
                                                id="customer_swift_code"
                                                label="Swift Code"
                                                margin="dense"
                                                name="customer_swift_code"
                                                value={this.state.customer_swift_code}
                                                onChange={this.onChange}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControl fullWidth={true}>
                                            <TextField
                                                required
                                                fullWidth
                                                margin="dense"
                                                id="customer_details_company"
                                                label="Company"
                                                value={this.state.customer_details_company}
                                                name="customer_details_company"
                                                onChange={this.onChange}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={2}></Grid>
                                    <Grid item xs={2}></Grid>
                                    <Grid item xs={4}>
                                        <FormControl fullWidth={true}>
                                            <TextField
                                                required
                                                fullWidth
                                                margin="dense"
                                                id="customer_details_project"
                                                label="Project"
                                                value={this.state.customer_details_project}
                                                name="customer_details_project"
                                                onChange={this.onChange}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <FormControl fullWidth={true}>
                                            <TextField
                                                required
                                                fullWidth
                                                margin="dense"
                                                id="customer_details_project"
                                                label="Country"
                                                value={this.state.customer_details_country}
                                                name="customer_details_country"
                                                onChange={this.onChange}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={2}></Grid>
                                    <Grid item xs={2}></Grid>
                                    <Grid item xs={8}>
                                        <FormControl fullWidth={true}>
                                            <TextField
                                                fullWidth
                                                margin="dense"
                                                id="customer_details_note"
                                                label="Note"
                                                value={this.state.customer_details_note}
                                                name="customer_details_note"
                                                onChange={this.onChange}
                                            />
                                        </FormControl>
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
                                        <Table style={{ width: '100%' }}>
                                            <TableHead>
                                                <TableRow>
                                                <TableCell align='center'>
                                                    </TableCell>
                                                    <TableCell align='center'>
                                                    PO No
                                                    </TableCell>
                                                    <TableCell align="center" >
                                                            Description
                                                    </TableCell>
                                                    <TableCell align="center">
                                                            Status
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {this.state.data.map(row => (
                                                 <TableRow hover role="checkbox" key={row.po_number_no} tabIndex={-1} >
                                                 <TableCell align="center">
                                                                <Tooltip title="Edit" aria-label="add">
                                                                    <Fab  size="small" color="primary" onClick={this.openEdit} >
                                                                        <EditIcon />
                                                                    </Fab>
                                                                </Tooltip>
                                                            </TableCell>
                                                     <TableCell align='center'>{row.po_number_no}</TableCell>
                                                     <TableCell  align='center' >{row.po_number_description}</TableCell>
                                                     <TableCell  align='center' >{row.status_po_name}</TableCell>
                                                </TableRow>
                                ))}
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
                                            onClick={this.cancel}>Cancel</Button>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Button style={{ marginTop: '20px' }}
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            color="secondary"
                                            disabled={this.state.disable}>Save</Button>
                                    </Grid>
                                    <Grid item xs={4}></Grid>
                                </Grid>
                            </form>
                        </div>
                        <Dialog open={this.state.edit} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Confirm delete</DialogTitle>
                        <DialogContent dividers>
                            <Typography variant="subtitle1" gutterBottom>
                                Are you sure you want to delete object of tag ?
                         </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button size="medium" variant="contained"  onClick={this.closeEdit}>
                                Cancel
                                        </Button>
                            <Button size="medium" color="secondary" variant="contained" >
                                Delete
                                        </Button>
                        </DialogActions>
                    </Dialog>
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
export default connect(mapStateToProps)(EditCustomer);