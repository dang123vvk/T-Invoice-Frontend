import React from 'react'
import { Container, CssBaseline, Table, TableHead, TableRow, TableCell, TableBody, Fab, Tooltip, TablePagination, TableFooter, AppBar, Toolbar, Grid, Button, TextField } from '@material-ui/core';
import { connect } from "react-redux";
import { Redirect } from 'react-router'
import NotFound from '../views/NotFound';
import EditIcon from '@material-ui/icons/Edit';
import SearchIcon from '@material-ui/icons/Search';
import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from '@material-ui/core/IconButton';
import ViewColumnButton from '@material-ui/icons/DescriptionOutlined';
import AddIcon from '@material-ui/icons/Add';
import './style.css';
import { getCustomerUserCurrent, getCustomerSearch } from '../share/services/customer.service';
import { Link } from "react-router-dom";
import DescriptionSharpIcon from '@material-ui/icons/DescriptionSharp';
import {
    ExcelExport,
    ExcelExportColumn,
    ExcelExportColumnGroup
} from '@progress/kendo-react-excel-export';
// import _ from 'lodash';


class ListCustomer extends React.Component {
    _exporter;
    export = () => {
        this._exporter.save();
    }
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            account_bank_id: null,
            redirect: false,
            redirectAddAccountBank: false,
            page: 0,
            rowsPerPage: 5,
        }
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        this.handleChangeSearch = this.handleChangeSearch.bind(this);
        document.title = 'Customers';
        this.openEdit = this.openEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.reload = this.reload.bind(this);
    }
    componentDidMount() {
        getCustomerUserCurrent(this.props.user_username,this.props.token).then(data => {
            this.setState({
                data: data.customers
            })
        });
    }
    handleSubmit(event, account_bank_id) {
        event.preventDefault();
        this.setState({
            redirect: true,
            account_bank_id: account_bank_id,
        })
    }
    handleSubmitAdd(event) {
        event.preventDefault();
        this.setState({
            redirectAddAccountBank: true,
        })
    }
    handleChangePage(event, newPage) {
        this.setState({
            page: newPage,
        })
    }
    handleChangeRowsPerPage(event) {
        this.setState({
            rowsPerPage: +event.target.value,
            page: 0
        })
    }
    handleChangeSearch(event){  
        getCustomerSearch(event.target.value,this.props.user_username,this.props.token).then(data=> {
            this.setState({
                data: data.customers
            })     
        })
    }

    openEdit(e, account_bank_id) {
        e.preventDefault();
        
    }
    closeEdit(e) {
        e.preventDefault();
        this.setState({
            edit: false
        })
    }
    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    reload(e){
        e.preventDefault();
        window.location.reload();
    }
    render() {
        this.state.data.map((key,index)=>{
            key.in = index +1;
        });
        const { redirect, redirectAddAccountBank } = this.state;
        if (redirect) {
            return <Redirect to={'/accountbank/' + this.state.account_bank_id} />;
        }
        if (redirectAddAccountBank) {
            return <Redirect to={'/accountbank'} />;
        }
        if( ((this.props.role === 'Director') && (localStorage.getItem('user_information'))) || ((this.props.role === 'Sr.Director') && (localStorage.getItem('user_information')))){
            return (
                <Container component="main" maxWidth="lg">
                    <CssBaseline />
                    <div style={{ marginTop: '1%' }}  >
                        <AppBar position="static" color="default" elevation={0}>
                            <Toolbar>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item>
                                        <SearchIcon color="inherit" />
                                    </Grid>
                                    <Grid item xs>
                                        <TextField
                                            fullWidth
                                            placeholder="Search by name, email, phone number or address"
                                            InputProps={{
                                                disableUnderline: true
                                            }}
                                            onChange={this.handleChangeSearch}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Link to='/customers/add' style={{ color: 'white', textDecoration: 'none' }}><Button variant="contained" color="primary" className="btn-without-border" >
                                            Add Customer
                                    </Button>
                                        </Link>
                                        <Tooltip title="Reload">
                                            <IconButton className="btn-without-border" onClick={this.reload}>
                                                <RefreshIcon color="inherit" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Export To Excel">
                                            <IconButton className="btn-without-border" onClick={this.export}>
                                                <DescriptionSharpIcon color="inherit" />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </Toolbar>
                        </AppBar>
                    </div>
                    <div style={{ marginTop: '2%' }}>
                        <Table style={{ width: '100%' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell align='center'>Name</TableCell>
                                    <TableCell align="center" >Email</TableCell>
                                    <TableCell align="center">Phone Number</TableCell>
                                    <TableCell align="center">Address</TableCell>
                                    <TableCell align='center'></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(this.state.rowsPerPage > 0 ? this.state.data.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage) : this.state.data).map(row => {
                                    return (
                                        <TableRow hover role="checkbox" key={row.customer_email} tabIndex={-1} >
                                            <TableCell align='center'>{row.customer_name}</TableCell>
                                            <TableCell align='center' >{row.customer_email}</TableCell>
                                            <TableCell align='center' >{row.customer_number_phone}</TableCell>
                                            <TableCell align='center' >{row.customer_address}</TableCell>
                                            <TableCell align="center">
                                            <Link to={'/customers/edit/'+row.customer_id } style={{ color: 'white', textDecoration: 'none' }}><Tooltip title="Edit" aria-label="add">
                                                 <Fab size="small" color="primary"  className="btn-without-border">
                                                       <EditIcon style={{ display: 'block' }} />
                                                    </Fab>
                                                    
                                                </Tooltip>
                                                </Link>
                                                <Link to={'/customers/detail/'+ row.customer_id} style={{ color: 'white', textDecoration: 'none' }}>
                                                <Tooltip title="Detail customer" aria-label="add">
                                                 <Fab size="small"   className="btn-without-border" style={{ marginLeft: '5%'}}>
                                                       <ViewColumnButton style={{ display: 'block' }} />
                                                    </Fab>
                                                </Tooltip>
                                                </Link>
                                                <Link to={'/bills/add/customer/'+ row.customer_id} style={{ color: 'white', textDecoration: 'none' }}>
                                                <Tooltip title="Add Bill" aria-label="add">
                                                 <Fab size="small"   className="btn-without-border" style={{ marginLeft: '5%'}}>
                                                       <AddIcon style={{ display: 'block' }} />
                                                    </Fab>
                                                </Tooltip>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                            <TableFooter >
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[5, 10, 15]}
                                        count={this.state.data.length}
                                        rowsPerPage={this.state.rowsPerPage}
                                        page={this.state.page}
                                        backIconButtonProps={{
                                            'aria-label': 'previous page',
                                        }}
                                        nextIconButtonProps={{
                                            'aria-label': 'next page',
                                        }}
                                        onChangePage={this.handleChangePage}
                                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                    <ExcelExport
                        data={this.state.data}
                        fileName="customers.xlsx"
                        ref={(exporter) => { this._exporter = exporter; }}
                    >
                        <ExcelExportColumnGroup title="List Bill" headerCellOptions={{ background: '#2196f3', textAlign: 'center' }}>
                            <ExcelExportColumn title="#" field="in" width={100} cellOptions={{
                                textAlign: 'center'
                            }} />
                            <ExcelExportColumn title="Name" field="customer_name" width={200} cellOptions={{
                                textAlign: 'center'
                            }} />
                            <ExcelExportColumn title="Email" field="customer_email" width={200} cellOptions={{
                                textAlign: 'center'
                            }} />
                            <ExcelExportColumn title="Phone Number" field="customer_number_phone" width={200} cellOptions={{
                                textAlign: 'center'
                            }} />
                            <ExcelExportColumn title="Address" field="customer_address" width={200} cellOptions={{
                                textAlign: 'center'
                            }} />
                            <ExcelExportColumn title="Company" field="customer_details_company" width={250} cellOptions={{
                                textAlign: 'center'
                            }} />
                            <ExcelExportColumn title="Project" field="customer_details_project" width={200} cellOptions={{
                                textAlign: 'center'
                            }} />
                        </ExcelExportColumnGroup>
                    </ExcelExport>
                </Container>
            )
        }
        return (
            <NotFound />
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
export default connect(mapStateToProps)(ListCustomer);