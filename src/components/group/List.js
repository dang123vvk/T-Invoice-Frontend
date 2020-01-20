import React from 'react';
import { Container, CssBaseline, AppBar, Toolbar, Grid, Tooltip, Table, TableHead, TableCell, TableRow, TableBody, TableFooter, TablePagination, TextField, Button, Fab} from '@material-ui/core';
import { connect } from "react-redux";
import NotFound from '../views/NotFound';
import { getGroupFromAdmin } from "../share/services/group.service";
import SearchIcon from '@material-ui/icons/Search';
import RefreshIcon from '@material-ui/icons/Refresh';
import IconButton from '@material-ui/core/IconButton';
import { Link } from "react-router-dom";
import EditIcon from '@material-ui/icons/Edit';
import ViewColumnButton from '@material-ui/icons/DescriptionOutlined';
class ListGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            page: 0,
            rowsPerPage: 4
        }
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
        document.title = 'Groups';
        this.reload = this.reload.bind(this);
    }
    componentDidMount() {
        getGroupFromAdmin(this.props.role, this.props.token).then(data =>{
            this.setState({
                data: data.groups
            })
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
    reload(e){
        e.preventDefault();
        window.location.reload();
    }
    render() {
    
        if((this.props.role === 'Admin') && (localStorage.getItem('user_information'))) {
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
                                            placeholder="Search by name or description"
                                            InputProps={{
                                                disableUnderline: true
                                            }}
                                            onChange={this.handleChangeSearch}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Link to='/admin/groups/add' style={{ color: 'white', textDecoration: 'none' }}><Button variant="contained" color="primary" className="btn-without-border" >
                                            Add Group
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
                                    <TableCell align='center'>Name</TableCell>
                                    <TableCell align="center" >Description</TableCell>
                                    <TableCell align='center'></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(this.state.rowsPerPage > 0 ? this.state.data.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage) : this.state.data).map(row => {
                                    return (
                                        <TableRow hover role="checkbox" key={row.groups_user_name} tabIndex={-1} >
                                            <TableCell align='center'>{row.groups_user_name}</TableCell>
                                            <TableCell align='center' >{row.groups_user_description}</TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="Edit" aria-label="add">
                                                <Link to={'/admin/groups/edit/' + row.groups_user_id } style={{ color: 'white', textDecoration: 'none' }}> <Fab size="small" color="primary" className="btn-without-border">
                                                        <EditIcon style={{ display: 'block' }} />
                                                    </Fab></Link>
                                                </Tooltip>
                                                <Tooltip title="View Users" aria-label="add">
                                                <Link to={'/admin/groups/users/'+ row.groups_user_id}>
                                                    <Fab size="small" color="primary" style={{marginLeft: '5%'}} className="btn-without-border">
                                                        <ViewColumnButton style={{ display: 'block' }} />
                                                    </Fab>
                                                    </Link>
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
            </Container>
        )
    }
    return (
     <NotFound />
    );
}
}
const mapStateToProps = state => {
    return {
        user_fullname: state.loginReducer.user_fullname,
        user_username: state.loginReducer.user_username,
        role: state.loginReducer.role,
        token: state.loginReducer.token,
        group: state.loginReducer.group
    };
  }
  export default connect(mapStateToProps) (ListGroup);