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
import { getAccountBankCurrent } from '../share/services/accountbank.service';
import { Link } from "react-router-dom";
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import  _ from 'lodash';

function PaperComponent(props) {
    return (
        <Draggable cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}

class ListAccountBank extends React.Component {
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
        document.title = 'List Account Bank';
        this.openEdit = this.openEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.reload = this.reload.bind(this);
    }
    componentDidMount() {
        getAccountBankCurrent().then(data => {
            this.setState({
                data: data.accountsbank
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
        })
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
        const { redirect, redirectAddAccountBank } = this.state;
        if (redirect) {
            return <Redirect to={'/accountbank/' + this.state.account_bank_id} />;
        }
        if (redirectAddAccountBank) {
            return <Redirect to={'/accountbank'} />;
        }
        if ((this.props.role) || (localStorage.getItem('user_information'))) {
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
                                            placeholder="Search by name, number, address or bank swift"
                                            InputProps={{
                                                disableUnderline: true
                                            }}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Link to='/accountbanks/add' style={{ color: 'white', textDecoration: 'none' }}><Button variant="contained" color="primary" className="btn-without-border" >
                                            Add Account Bank
                                    </Button>
                                        </Link>
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
                    <div style={{ marginTop: '2%' }}>
                        <Table style={{ width: '100%' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell align='center'>Account Bank Number</TableCell>
                                    <TableCell align="center" >Account Bank Name</TableCell>
                                    <TableCell align="center">Account Bank Address</TableCell>
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
                                <Button variant="contained" style={{ backgroundColor: 'red', color: 'white' }} onClick={this.closeEdit}>Cancel</Button>
                                <Button color="primary" variant="contained" >Save</Button>
                            </DialogActions>
                        </Dialog>
                    </div>
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
        role: state.loginReducer.role
    };
}
export default connect(mapStateToProps)(ListAccountBank);