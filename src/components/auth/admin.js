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
import BuildIcon from '@material-ui/icons/BuildOutlined';
import AddIcon from '@material-ui/icons/Add';
import { getAllUser, getUserFromAdminSearch } from '../share/services/user.service';
import { Link } from "react-router-dom";
import DescriptionSharpIcon from '@material-ui/icons/DescriptionSharp';
import {
    ExcelExport,
    ExcelExportColumn,
    ExcelExportColumnGroup
} from '@progress/kendo-react-excel-export';
import { loginAction } from '../reducers/action';
// import _ from 'lodash';


class AdminDashboard extends React.Component {
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
        document.title = 'Admin Dashboard';
        this.openEdit = this.openEdit.bind(this);
        this.closeEdit = this.closeEdit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.reload = this.reload.bind(this);
    }
    componentDidMount() {
        getAllUser(this.props.role,this.props.token).then(data => {
           this.setState({
               data: data.users
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
        event.preventDefault();
        if(event.target.value === '')
        {
            getAllUser(this.props.role,this.props.token).then(data => {
                this.setState({
                    data: data.users
                })
                
             });
            
        }else {
            getUserFromAdminSearch(event.target.value,this.props.role,this.props.token).then(data=> {
                this.setState({
                    data: data.users
                })     
            })
        }
      
    
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
        if ((this.props.role === 'Admin') && (localStorage.getItem('user_information'))) {
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
                                            placeholder="Search by full name, user name or email"
                                            InputProps={{
                                                disableUnderline: true
                                            }}
                                            onChange={this.handleChangeSearch}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Link to='/admin/users/add' style={{ color: 'white', textDecoration: 'none' }}><Button variant="contained" color="primary" className="btn-without-border" >
                                            Add User
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
                                    <TableCell align='center'>Full Name</TableCell>
                                    <TableCell align="center" >User Name</TableCell>
                                    <TableCell align="center" >Email</TableCell>
                                    <TableCell align="center" >Date Added</TableCell>
                                    <TableCell align='center'></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(this.state.rowsPerPage > 0 ? this.state.data.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage) : this.state.data).map(row => {
                                    return (
                                        <TableRow hover role="checkbox" key={row.user_fullname} tabIndex={-1} >
                                            <TableCell align='center'>{row.user_fullname}</TableCell>
                                            <TableCell align='center' >{row.user_username}</TableCell>
                                            <TableCell align='center' >{row.user_email}</TableCell>
                                            <TableCell align='center' >{row.user_dateAdd}</TableCell>
                                            <TableCell align="center">
                                            <Link to={'/admin/users/edit/'+row.user_id } style={{ color: 'white', textDecoration: 'none' }}><Tooltip title="Edit" aria-label="add">
                                                 <Fab size="small" color="primary"  className="btn-without-border">
                                                       <EditIcon style={{ display: 'block' }} />
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
                        fileName="users.xlsx"
                        ref={(exporter) => { this._exporter = exporter; }}
                    >
                        <ExcelExportColumnGroup title="Users" headerCellOptions={{ background: '#2196f3', textAlign: 'center' }}>
                            <ExcelExportColumn title="#" field="in" width={100} cellOptions={{
                                textAlign: 'center'
                            }} />
                            <ExcelExportColumn title="Full Name" field="user_fullname" width={200} cellOptions={{
                                textAlign: 'center'
                            }} />
                            <ExcelExportColumn title="User Name" field="user_username" width={200} cellOptions={{
                                textAlign: 'center'
                            }} />
                            <ExcelExportColumn title="Email" field="user_email" width={200} cellOptions={{
                                textAlign: 'center'
                            }} />
                            <ExcelExportColumn title="Date Added" field="user_dateAdd" width={200} cellOptions={{
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
const mapDispatchToProps = (dispatch) => ({
    login: (user_fullname,user_username,token, role) => dispatch(loginAction(user_fullname,user_username, token,role))
  });
  
export default connect(mapStateToProps,mapDispatchToProps)(AdminDashboard);