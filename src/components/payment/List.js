import React from 'react'
import { Container, CssBaseline, Table, TableHead, TableRow, TableCell, TableBody, Fab, Tooltip, TablePagination, TableFooter, AppBar, Toolbar, Grid, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { connect } from "react-redux";
import { Redirect } from 'react-router'
import NotFound from '../views/NotFound';
import EditIcon from '@material-ui/icons/Edit';
import SearchIcon from '@material-ui/icons/Search';
import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from '@material-ui/core/IconButton';
import './style.css';
import { getAccountBankCurrent, getAccountBankCurrentSearch, updateAccountBank } from '../share/services/accountbank.service';
import { Link } from "react-router-dom";
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import  _ from 'lodash';
import DescriptionSharpIcon from '@material-ui/icons/DescriptionSharp';
import {
    ExcelExport,
    ExcelExportColumn,
    ExcelExportColumnGroup
} from '@progress/kendo-react-excel-export';
import './style.css';

function PaperComponent(props) {
    return (
        <Draggable cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}
class ListPayment extends React.Component {
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
            rowsPerPage: 4,
            edit: false,
            account_bank_number: '',
            account_bank_name: '',
            account_bank_address: '',
            account_bank_swift: '',
        }
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        this.handleChangeSearch = this.handleChangeSearch.bind(this);
        document.title = 'Exchange rates';
        this.openEdit = this.openEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.reload = this.reload.bind(this);
        this.save = this.save.bind(this);
    }
    componentDidMount() {
        getAccountBankCurrent(this.props.token).then(data => {
            this.setState({
                data: data.accountsbank
            })
        });
    }
    handleSubmitExportExcel(event,data) {
        event.preventDefault();
        this._exporter.save();
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
        getAccountBankCurrentSearch(event.target.value,this.props.token).then(data=> {
            this.setState({
                data: data.accountsbank
            })     
        })
    }
    openEdit(e, account_bank_id) {
        e.preventDefault();
        var index = _.findIndex(this.state.data, function (ac) { return ac.account_bank_id === account_bank_id; });
        var temp = this.state.data;
        this.setState({
            edit: true,
            account_bank_number: temp[index].account_bank_number,
            account_bank_name: temp[index].account_bank_name,
            account_bank_address: temp[index].account_bank_address,
            account_bank_swift: temp[index].account_bank_swift,
            account_bank_id: account_bank_id
        })
    }
    closeEdit(e) {
        e.preventDefault();
        this.setState({
            edit: false
        })
    }
    save(e,account_bank_id) {
        e.preventDefault();
        const accountbank = {
            account_bank_number: this.state.account_bank_number,
            account_bank_name: this.state.account_bank_name,
            account_bank_address: this.state.account_bank_address,
            account_bank_swift: this.state.account_bank_swift,
          };
        updateAccountBank(account_bank_id,accountbank,this.props.token).then(data => {});
        var index = _.findIndex(this.state.data, function (ac) { return ac.account_bank_id === account_bank_id; });
        var temp = this.state.data;
        const accountbank_1 = {
            account_bank_id: account_bank_id,
            account_bank_number: this.state.account_bank_number,
            account_bank_name: this.state.account_bank_name,
            account_bank_address: this.state.account_bank_address,
            account_bank_swift: this.state.account_bank_swift,
          };
          temp[index] = accountbank_1;
        this.setState({
            edit: false,
            data: temp,
        })
    }
    onChange(e) {
        e.preventDefault();
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
        if ((this.props.role === 'Admin') && (localStorage.getItem('user_information'))) {
            return (
                <Container component="main" maxWidth="lg">
                    <CssBaseline />
                    <div className ='divClass'  >
                        <AppBar position="static" color="default" elevation={0}>
                            <Toolbar>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item>
                                        <SearchIcon color="inherit" />
                                    </Grid>
                                    <Grid item xs>
                                        <TextField
                                            fullWidth
                                            placeholder="Search by name, number, address or bank swift"
                                            InputProps={{
                                                disableUnderline: true
                                            }}
                                            onChange={this.handleChangeSearch}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Link to='/accountbanks/exchange-rates/add' id='linkList'><Button variant="contained" color="primary" className="btn-without-border" >
                                            Add currency
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
                                    <TableCell align='center'>Currency Name	</TableCell>
                                    <TableCell align="center" >Currency Code</TableCell>
                                    <TableCell align="center">Selling Rates</TableCell>
                                    <TableCell align="center">Account Bank Swift</TableCell>
                                    <TableCell align='center'></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(this.state.rowsPerPage > 0 ? this.state.data.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage) : this.state.data).map(row => {
                                    return (
                                        <TableRow hover role="checkbox" key={row.account_bank_number} tabIndex={-1} >
                                            <TableCell align='center'>{row.account_bank_number}</TableCell>
                                            <TableCell align='center' >{row.account_bank_name}</TableCell>
                                            <TableCell align='center' >{row.account_bank_address}</TableCell>
                                            <TableCell align='center' >{row.account_bank_swift}</TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="Edit" aria-label="add">
                                                    <Fab size="small" color="primary" onClick={e => this.openEdit(e,row.account_bank_id)} className="btn-without-border">
                                                        <EditIcon style={{ display: 'block' }} />
                                                    </Fab>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                            <TableFooter >
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[2, 4, 6]}
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
                    <div >
                        <Dialog PaperComponent={PaperComponent} open={this.state.edit} aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">Edit Account Bank</DialogTitle>
                            <DialogContent >
                                <div id="configuration" className="container" ><br />
                                    <div className="row d-flex align-items-center">
                                        <div className="col-sm-5">Account Bank Number</div>
                                        <div className="col-sm-7">
                                            <TextField
                                                margin="dense"
                                                variant="outlined"
                                                value={this.state.account_bank_number}
                                                fullWidth
                                                name="account_bank_number"
                                                onChange={this.onChange}
                                            />
                                        </div>
                                        <div className="col-sm-5">Account Bank Name </div>
                                        <div className="col-sm-7">
                                            <TextField
                                                margin="dense"
                                                variant="outlined"
                                                value={this.state.account_bank_name}
                                                fullWidth
                                                name="account_bank_name"
                                                onChange={this.onChange}
                                            />
                                        </div>
                                        <div className="col-sm-5">Account Bank Address</div>
                                        <div className="col-sm-7">
                                            <TextField
                                                margin="dense"
                                                variant="outlined"
                                                name="account_bank_address"
                                                value={this.state.account_bank_address}
                                                onChange={this.onChange}
                                                fullWidth
                                            />
                                        </div>
                                        <div className="col-sm-5">Account Bank Swift</div>
                                        <div className="col-sm-7">
                                            <TextField
                                                margin="dense"
                                                variant="outlined"
                                                name="account_bank_swift"
                                                onChange={this.onChange}
                                                value={this.state.account_bank_swift}
                                                fullWidth
                                            />
                                        </div>
                                    </div>
                                </div>

                            </DialogContent>
                            <DialogActions>
                                <Button variant="contained" id='buttonCancel' onClick={this.closeEdit}>Cancel</Button>
                                <Button color="primary" variant="contained" onClick={e => this.save(e,this.state.account_bank_id)} >Save</Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                    <ExcelExport
                        data={this.state.data}
                        fileName="accountbanks.xlsx"
                        ref={(exporter) => { this._exporter = exporter; }}
                    >
                        <ExcelExportColumnGroup title="Account Bank" headerCellOptions={{ background: '#2196f3', textAlign: 'center' }}>
                            <ExcelExportColumn title="#" field="in" width={100} cellOptions={{
                                textAlign: 'center'
                            }} />
                            <ExcelExportColumn title="Account Bank Number" field="account_bank_number" width={200} cellOptions={{
                                textAlign: 'center'
                            }} />
                            <ExcelExportColumn title="Account Bank Name" field="account_bank_name" width={200} cellOptions={{
                                textAlign: 'center'
                            }} />
                            <ExcelExportColumn title="Account Bank Address" field="account_bank_address" width={200} cellOptions={{
                                textAlign: 'center'
                            }} />
                            <ExcelExportColumn title="Account Bank Swift" field="account_bank_swift" width={200} cellOptions={{
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
        role: state.loginReducer.role,
        token: state.loginReducer.token,
        group: state.loginReducer.group
    };
}
export default connect(mapStateToProps)(ListPayment);