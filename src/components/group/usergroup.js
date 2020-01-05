import React from 'react';
import MaterialTable from 'material-table';
import { Container, CssBaseline, Typography } from '@material-ui/core';
import axios from 'axios';
import { connect } from "react-redux";
import { Redirect } from 'react-router';
import ErrorAdmin from '../share/error.admin';
import { API } from '../share/api';
const API_URL = API + 'users/groups/';
const API_URL_GROUP = API + 'groups/';
class ListUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { title: 'Id', field: 'user_id', hidden: true },
                { title: 'Full Name', field: 'user_fullname' },
                { title: 'User Name', field: 'user_username' },
                { title: 'Role', field: 'role_name' },
                { title: 'Group', field: 'groups_user_name' },
            ],
            data: [
            ],
            users: [],

            groups_user_name: '',
            redirectUserAdd: false,
            redirectUserEdit: false,
            redirectViewCustomer: false,
        }
        this.handleSubmitAdd = this.handleSubmitAdd.bind(this);
    }
    componentDidMount() {
        axios.get(API_URL+  this.props.match.params.id,{ headers: { Authorization: localStorage.getItem('token') } })
            .then(response => {
                this.setState({ data: response.data.users });
               
            })
            .catch(err => console.log(err));

            axios.get(API_URL_GROUP+  this.props.match.params.id,{ headers: { Authorization: localStorage.getItem('token') } })
            .then(response => {
                this.setState({ groups_user_name: response.data.group.groups_user_name });
            })
            .catch(err => console.log(err));
    }
    handleSubmit (event, user_id) {
        event.preventDefault();
       this.setState({
        redirectUserEdit:true,
            user_id: user_id,

       })
      }
      handleSubmitCustomer (event, user_id) {
        event.preventDefault();
       this.setState({
        redirectViewCustomer:true,
        user_id: user_id,

       })
      }
      handleSubmitAdd(event) {
        event.preventDefault();
        this.setState({
            redirectUserAdd: true,

        })
    }
    render() {
        const { redirectUserAdd, redirectUserEdit,redirectViewCustomer } = this.state;
        if (redirectUserAdd) {
            return <Redirect to='/user-add'/>;
          }
          if (redirectUserEdit) {
              return <Redirect to={'/user-edit/'+this.state.user_id}/>;
            }
            if (redirectViewCustomer) {
              return <Redirect to={'/user-view-customers/'+this.state.user_id}/>;
            }
        if ((((this.props.isLogin)  &&  (localStorage.getItem('role_id')==1))) || ((localStorage.getItem('user_name')) &&  (localStorage.getItem('role_id')==1)))
        {
        return (
            <Container component="main" maxWidth="lg">
                <CssBaseline />
                <div style={{ marginTop: '20px' }}>
                    <MaterialTable
                        title={'List User of '+this.state.groups_user_name}
                        columns={this.state.columns}
                        data={this.state.data}
                        editable={{
                            onRowDelete: oldData =>
                                new Promise((resolve, reject) => {
                                    setTimeout(() => {
                                        {
                                            let data = this.state.data;
                                            const index = data.indexOf(oldData);
                                            data.splice(index, 1);
                                            this.setState({ data }, () => resolve());
                                        }
                                        resolve()
                                    }, 1000)
                                }),
                        }}
                        actions={[
                            {
                                icon: 'edit',
                                tooltip: 'Edit User',
                                onClick: (event, rowData) =>  this.handleSubmit(event,rowData.user_id)
                                
                            },
                            {
                                    icon: 'add',
                                    tooltip: 'Add A User',
                                    isFreeAction: true,
                                    onClick: (event) => this.handleSubmitAdd(event)

                                }
                        ]}
                        options={{
      search: true,
      exportButton: true,
      exportAllData:true,
      
    }}
                    />
                </div>
            </Container>
        );
    }
    return (
  <ErrorAdmin />
    );
}
}
const mapStateToProps = state => {
    return {
      title: state.loginReducer.username,
      isLogin: state.loginReducer.isLogin
    };
  }
  export default connect(mapStateToProps) (ListUser);