import React from 'react';
import {  Table, TableHead, TableRow, TableCell, TableBody, Fab, Tooltip, TablePagination, TableFooter, AppBar, Toolbar, Grid, Button, TextField } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import { connect } from "react-redux";
import NotFound from '../views/NotFound';
import { Link } from "react-router-dom";
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import RefreshIcon from '@material-ui/icons/Refresh';
import GetAppIcon from '@material-ui/icons/GetAppSharp';
import DescriptionSharpIcon from '@material-ui/icons/DescriptionSharp';
import {
    ExcelExport,
    ExcelExportColumn,
    ExcelExportColumnGroup
} from '@progress/kendo-react-excel-export';
import {month} from '../share/month';
import { getBillUserCurrent, getBillUserCurrentSearch } from '../share/services/bill.service';
class ListBill extends React.Component {
    _exporter;
    export = () => {
        this._exporter.save();
    }
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            redirect: false,
            bill_id: null,
            redirectAdd: false,
            reactDetail: false,
            page: 0,
            rowsPerPage: 5,
        };
        document.title = 'Bills';
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeSearch = this.handleChangeSearch.bind(this);  
        this.reload = this.reload.bind(this);
    }
    componentDidMount() {
        getBillUserCurrent(this.props.user_username,this.props.token).then(data => {
            this.setState({
                data: data.bill
            })
        })
 
    }
    handleSubmit(event, bill_id) {
        event.preventDefault();
        this.setState({
            redirect: true,
            bill_id: bill_id,
        })
    }
    handleSubmitExport(event, bill_id) {
        event.preventDefault();
        this.setState({
            reactDetail: true,
            bill_id: bill_id,
        })
    }
    handleSubmitAdd(event) {
        event.preventDefault();
        this.setState({
            redirectAdd: true,
        })
    }
    handleSubmitExportExcel(event,data) {
        event.preventDefault();
        this._exporter.save();
    }
    handleChangeRowsPerPage(event) {
        this.setState({
            rowsPerPage: +event.target.value,
            page: 0
        })
    }
    handleChangePage(event, newPage) {
        this.setState({
            page: newPage,
        })
    }
    handleChangeSearch(event){  
        getBillUserCurrentSearch(event.target.value,this.props.user_username,this.props.token).then(data=> {
            this.setState({
                data: data.bill
            })     
        })
    }
    reload(e){
        e.preventDefault();
        window.location.reload();
    }
    render() {
        this.state.data.map((key,index)=>{
            key.in = index +1;
            key.month= month(key.bill_monthly_cost.slice(5,7)) + " " + key.bill_monthly_cost.slice(0,4);
        });
        if( ((this.props.role === 'Director') && (localStorage.getItem('user_information'))) || ((this.props.role === 'Sr.Director') && (localStorage.getItem('user_information')))){
            return (
                <Container component="main">
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
                                            placeholder="Search by customer, status, date"
                                            InputProps={{
                                                disableUnderline: true
                                            }}
                                            onChange={this.handleChangeSearch}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Link to='/bills/add' style={{ color: 'white', textDecoration: 'none' }}><Button variant="contained" color="primary" className="btn-without-border" >
                                            Add Bill
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
                                    <TableCell align='center'>Month</TableCell>
                                    <TableCell align="center" >Customer</TableCell>
                                    <TableCell align="center">Status</TableCell>
                                    <TableCell align="center">Sum</TableCell>
                                    <TableCell align="center">Date</TableCell>
                                    <TableCell align='center'></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(this.state.rowsPerPage > 0 ? this.state.data.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage) : this.state.data).map(row => {
                                    return (
                                        <TableRow hover role="checkbox" key={row.bills_sum} tabIndex={-1} >
                                            <TableCell align='center'>{row.month}</TableCell>
                                            <TableCell align='center' >{row.customer_name}</TableCell>
                                            <TableCell align='center' >{row.status_bill_name}</TableCell>
                                            <TableCell align='center' >{row.bills_sum}</TableCell>
                                            <TableCell align='center' >{row.bill_date}</TableCell>
                                            <TableCell align="center">
                                            <Link to={'/bills/edit/'+ row.bill_id} style={{ color: 'white', textDecoration: 'none' }}><Tooltip title="Edit" aria-label="add">
                                                 <Fab size="small" color="primary"  className="btn-without-border">
                                                       <EditIcon style={{ display: 'block' }} />
                                                    </Fab>
                                                    
                                                </Tooltip>
                                                </Link>
                                                <Link to={'/bills/export/'+ row.bill_id} style={{ color: 'white', textDecoration: 'none' }}>
                                                <Tooltip title="Export" aria-label="add">
                                                 <Fab size="small"   className="btn-without-border" style={{ marginLeft: '5%', backgroundColor:'white'}}>
                                                       <GetAppIcon style={{ display: 'block', color: '#65819D' }} />
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
                        fileName="bills.xlsx"
                        ref={(exporter) => { this._exporter = exporter; }}
                    >
                        <ExcelExportColumnGroup title="List Bill" headerCellOptions={{ background: '#2196f3', textAlign: 'center' }}>
                            <ExcelExportColumn title="#" field="in" width={100} cellOptions={{
                                textAlign: 'center'
                            }} />
                            <ExcelExportColumn title="Month" field="month" width={200} cellOptions={{
                                textAlign: 'center'
                            }} />
                            <ExcelExportColumn title="Customer" field="customer_name" width={200} cellOptions={{
                                textAlign: 'center'
                            }} />
                            <ExcelExportColumn title="Status" field="status_bill_name" width={200} cellOptions={{
                                textAlign: 'center'
                            }} />
                            <ExcelExportColumn title="Sum" field="bills_sum" width={200} cellOptions={{
                                textAlign: 'center'
                            }} />
                            <ExcelExportColumn title="People Enter The Bill" field="user_fullname" width={250} cellOptions={{
                                textAlign: 'center'
                            }} />
                            <ExcelExportColumn title="Date" field="bill_date" width={200} cellOptions={{
                                textAlign: 'center'
                            }} />
                        </ExcelExportColumnGroup>
                    </ExcelExport>
                </Container>
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
        user_username: state.loginReducer.user_username,
        role: state.loginReducer.role,
        token: state.loginReducer.token
    };
}
export default connect(mapStateToProps)(ListBill);