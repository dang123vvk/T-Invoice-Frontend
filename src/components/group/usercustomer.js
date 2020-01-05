import React from 'react';
import MaterialTable from 'material-table';
import { Container, CssBaseline, Typography } from '@material-ui/core';
import axios from 'axios';
import { connect } from "react-redux";
import { Redirect } from 'react-router';
import ErrorAdmin from '../share/error.admin'
import { API } from '../share/api';
const API_URL = API + 'users/groups/senior/';
const API_URL_GROUP = API + 'groups/';
class ListUserInGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { title: 'Id', field: 'user_id', hidden: true },
                { title: 'Full Name', field: 'user_fullname' },
                { title: 'User Name', field: 'user_username' },
            ],
            data: [
            ],
            users: [],
            groups_user_name: '',
            redirectViewCustomer: false,
        }
        this.handleSubmitCustomer = this.handleSubmitCustomer.bind(this);
    }
    componentDidMount() {
        axios.get(API_URL+  localStorage.getItem('groups_user_id'),{ headers: { Authorization: localStorage.getItem('token') } })
            .then(response => {
                this.setState({ data: response.data.users });
               
            })
            .catch(err => console.log(err));

            axios.get(API_URL_GROUP+  localStorage.getItem('groups_user_id'),{ headers: { Authorization: localStorage.getItem('token') } })
            .then(response => {
                this.setState({ groups_user_name: response.data.group.groups_user_name });
            })
            .catch(err => console.log(err));
    }

      handleSubmitCustomer (event, user_id) {
        event.preventDefault();
       this.setState({
        redirectViewCustomer:true,
        user_id: user_id,

       })
      }
     
    render() {
        const { redirectViewCustomer } = this.state;
            if (redirectViewCustomer) {
              return <Redirect to={'/customer-director/'+this.state.user_id}/>;
            }
            if((this.props.isSenior == 'true') || (localStorage.getItem('role_id')==3))
        {
        return (
            <Container component="main" maxWidth="lg">
                <CssBaseline />
                <div style={{ marginTop: '20px' }}>
                    <MaterialTable
                        title={'Director in '+this.state.groups_user_name}
                        columns={this.state.columns}
                        data={this.state.data}
                        actions={[
                            {
                                icon: 'view_column',
                                tooltip: 'View Customers',
                                onClick: (event, rowData) =>  this.handleSubmitCustomer(event,rowData.user_id)
                                
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
      isLogin: state.loginReducer.isLogin,
      isSenior: state.loginReducer.isSenior
    };
  }
  export default connect(mapStateToProps) (ListUserInGroup);