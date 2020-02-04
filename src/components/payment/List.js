import React from 'react'
import { Container, CssBaseline, Table, TableHead, TableRow, TableCell, TableBody, Fab, Tooltip, AppBar, Toolbar, Grid, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Input } from '@material-ui/core';
import { connect } from "react-redux";
import NotFound from '../views/NotFound';
import EditIcon from '@material-ui/icons/Edit';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from '@material-ui/core/IconButton';
import './style.css';
import { getCurrencies, postCurrency, updateCurrency, getId, getCurrenciesNextMonth } from '../share/services/currency.service';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import _ from 'lodash';
import DescriptionSharpIcon from '@material-ui/icons/DescriptionSharp';
import {
    ExcelExport,
    ExcelExportColumn,
    ExcelExportColumnGroup
} from '@progress/kendo-react-excel-export';
import './style.css';
import { month } from '../share/month';

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
            redirect: false,
            edit: false,
            currency_name: '',
            currency_code: '',
            currency_month: '',
            currency_rate: 0,
            currency_id: 0,
            add: false,
            month_search: '',

        }
        this.handleChangeSearch = this.handleChangeSearch.bind(this);
        document.title = 'Exchange rates this month';
        this.openEdit = this.openEdit.bind(this);
        this.openAdd = this.openAdd.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.reload = this.reload.bind(this);
        this.save = this.save.bind(this);
        this.addCurrency = this.addCurrency.bind(this);
        this.cloneNextMonth = this.cloneNextMonth.bind(this);
    }
    componentDidMount() {
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        if (month < 10) month = "0" + month;
        if (date < 10) date = "0" + date;
        this.setState({
            currency_month: year + '-' + month,
            month_search: year + '-' + month
        });
        getCurrencies(year + '-' + month, this.props.role, this.props.token).then(data => {
            this.setState({
                data: data.currencies
            })
        });
    }
    handleSubmitExportExcel(event, data) {
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
    handleChangeSearch(e) {
        e.preventDefault();
        this.setState({
            [e.target.name]: e.target.value,
        });
        getCurrencies(e.target.value, this.props.role, this.props.token).then(data => {
            this.setState({
                data: data.currencies
            })
        });
    }
    openAdd(e) {
        e.preventDefault();
        getId(this.props.role, this.props.token).then(data => {
            this.setState({
                currency_id: data.id[0].id
            })
        })
        this.setState({
            add: true,
            currency_name: '',
            currency_code: '',
            currency_rate: 0,
        })
    }
    openEdit(e, currency_id) {
        e.preventDefault();
        var index = _.findIndex(this.state.data, function (ac) { return ac.currency_id === currency_id; });
        var temp = this.state.data;
        this.setState({
            edit: true,
            currency_name: temp[index].currency_name,
            currency_code: temp[index].currency_code,
            currency_rate: temp[index].currency_rate,
            currency_id: currency_id
        })
    }
    closeEdit(e) {
        e.preventDefault();
        this.setState({
            edit: false,
            add: false
        })
    }
    save(e, currency_id) {
        e.preventDefault();
        const currency = {
            currency_name: this.state.currency_name,
            currency_code: this.state.currency_code,
            currency_rate: this.state.currency_rate,
        };
        updateCurrency(currency_id, currency, this.props.role, this.props.token).then(data => { });
        var index = _.findIndex(this.state.data, function (currency) { return currency.currency_id === currency_id; });
        var temp = this.state.data;
        const currency1 = {
            currency_id: this.state.currency_id,
            currency_name: this.state.currency_name,
            currency_code: this.state.currency_code,
            currency_month: this.state.currency_month,
            currency_rate: this.state.currency_rate,
        };
        temp[index] = currency1;
        this.setState({
            edit: false,
            data: temp,
        })
    }
    addCurrency(e) {
        e.preventDefault();
        const currency = {
            currency_name: this.state.currency_name,
            currency_code: this.state.currency_code,
            currency_rate: this.state.currency_rate,
            currency_month: this.state.currency_month
        };
        postCurrency(currency, this.props.role, this.props.token).then(data => { });
        var currency_id = this.state.currency_id + 1;
        const currency1 = {
            currency_name: this.state.currency_name,
            currency_id: currency_id,
            currency_code: this.state.currency_code,
            currency_rate: this.state.currency_rate,
            currency_month: this.state.currency_month
        };
        this.setState(state => {
            const list = state.data.push(currency1);
            return {
                list,
                edit: false,
                add: false
            }
        });
    }
    onChange(e) {
        e.preventDefault();
        this.setState({
            [e.target.name]: e.target.value,
        });
    }
    reload(e) {
        e.preventDefault();
        window.location.reload();
    }
    cloneNextMonth(e) {
        e.preventDefault();
        getCurrenciesNextMonth(this.state.currency_month, this.props.role, this.props.token).then(data => {
        })
    }
    render() {
        this.state.data.map((key, index) => {
            key.in = index + 1;
            key.month = month(key.currency_month.slice(5, 7)) + " " + key.currency_month.slice(0, 4);
        });
        if ((this.props.role === 'Admin') && (localStorage.getItem('user_information'))) {
            return (
                <Container component="main" maxWidth="lg">
                    <CssBaseline />
                    <div className='divClass'  >
                        <AppBar position="static" color="default" elevation={0}>
                            <Toolbar>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item>
                                        <b>Month</b>  &nbsp;  &nbsp;  &nbsp;
                                        <TextField variant="outlined"
                                            type="month"
                                            value={this.state.month_search}
                                            onChange={this.handleChangeSearch}
                                            name='month_search'
                                            inputProps={{
                                                'aria-label': 'Description',
                                            }}
                                            margin='dense' />
                                        &nbsp;  &nbsp;
                                        <Tooltip title="Export To Excel">
                                            <IconButton className="btn-without-border" onClick={this.export}>
                                                <DescriptionSharpIcon color="inherit" />
                                            </IconButton>
                                        </Tooltip>
                                        &nbsp;  &nbsp;
                                        <Tooltip title="Clone Exchange Rates for Next Month">
                                            <IconButton className="btn-without-border" onClick={this.cloneNextMonth}>
                                                <AddCircleOutlineIcon color="inherit" />
                                            </IconButton>
                                        </Tooltip>
                                        &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;

                                            <Button variant="contained" color="primary" className="btn-without-border" onClick={this.openAdd} >
                                            Add currency
                                            </Button>

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
                                    <TableCell align='center' ></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(this.state.data).map(row => {
                                    return (
                                        <TableRow hover role="checkbox" key={row.currency_code} tabIndex={-1} >
                                            <TableCell align='center'>{row.currency_name}</TableCell>
                                            <TableCell align='center' >{row.currency_code}</TableCell>
                                            <TableCell align='center' >{row.currency_rate}</TableCell>
                                            <TableCell align='center' >
                                                <Tooltip title="Edit" aria-label="add">
                                                    <Fab size="small" color="primary" className="btn-without-border" onClick={e => this.openEdit(e, row.currency_id)}>
                                                        <EditIcon style={{ display: 'block' }} />
                                                    </Fab>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                    <div className='divClass'  >
                        <AppBar position="static" color="default" elevation={0}>
                            <Toolbar>
                                <Grid container spacing={2} direction="row" justify="center" alignItems="center">
                                    <Grid item   >
                                        <Tooltip title="Reload">
                                            <IconButton className="btn-without-border" onClick={this.reload}>
                                                <RefreshIcon color="inherit" />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </Toolbar>
                        </AppBar>
                    </div>
                    <div >
                        <Dialog PaperComponent={PaperComponent} open={this.state.add} aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">Add A Currency</DialogTitle>
                            <DialogContent >
                                <div id="configuration" className="container" ><br />
                                    <div className="row d-flex align-items-center">
                                        <div className="col-sm-5">Currency Name</div>
                                        <div className="col-sm-7">
                                            <TextField
                                                margin="dense"
                                                variant="outlined"
                                                value={this.state.currency_name}
                                                fullWidth
                                                name="currency_name"
                                                onChange={this.onChange}
                                            />
                                        </div>
                                        <div className="col-sm-5">Currency Code</div>
                                        <div className="col-sm-7">
                                            <TextField
                                                margin="dense"
                                                variant="outlined"
                                                value={this.state.currency_code}
                                                fullWidth
                                                name="currency_code"
                                                onChange={this.onChange}
                                            />
                                        </div>
                                        <div className="col-sm-5" style={{ marginTop: '2%', marginBottom: '2%' }}>Month</div>
                                        <div className="col-sm-7" style={{ marginTop: '2%', marginBottom: '2%' }}>
                                            February 2020
                                        </div>
                                        <div className="col-sm-5">Selling Rates</div>
                                        <div className="col-sm-7">
                                            <TextField
                                                margin="dense"
                                                variant="outlined"
                                                name="currency_rate"
                                                onChange={this.onChange}
                                                value={this.state.currency_rate}
                                                fullWidth
                                                type='number'
                                            />
                                        </div>
                                    </div>
                                </div>

                            </DialogContent>
                            <DialogActions>
                                <Button variant="contained" id='buttonCancel' onClick={this.closeEdit}>Cancel</Button>
                                <Button color="primary" variant="contained" onClick={this.addCurrency} >Save</Button>
                            </DialogActions>
                        </Dialog>
                        <Dialog PaperComponent={PaperComponent} open={this.state.edit} aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">Edit A Currency</DialogTitle>
                            <DialogContent >
                                <div id="configuration" className="container" ><br />
                                    <div className="row d-flex align-items-center">
                                        <div className="col-sm-5">Currency Name</div>
                                        <div className="col-sm-7">
                                            <TextField
                                                margin="dense"
                                                variant="outlined"
                                                value={this.state.currency_name}
                                                fullWidth
                                                name="currency_name"
                                                onChange={this.onChange}
                                            />
                                        </div>
                                        <div className="col-sm-5">Currency Code</div>
                                        <div className="col-sm-7">
                                            <TextField
                                                margin="dense"
                                                variant="outlined"
                                                value={this.state.currency_code}
                                                fullWidth
                                                name="currency_code"
                                                onChange={this.onChange}
                                            />
                                        </div>
                                        <div className="col-sm-5">Selling Rates</div>
                                        <div className="col-sm-7">
                                            <TextField
                                                margin="dense"
                                                variant="outlined"
                                                name="currency_rate"
                                                onChange={this.onChange}
                                                value={this.state.currency_rate}
                                                fullWidth
                                                type='number'
                                            />
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                            <DialogActions>
                                <Button variant="contained" id='buttonCancel' onClick={this.closeEdit}>Cancel</Button>
                                <Button color="primary" variant="contained" onClick={e => this.save(e, this.state.currency_id)} >Save</Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                    <ExcelExport
                        data={this.state.data}
                        fileName="exchangerates.xlsx"
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