import React from 'react';
import MaterialTable from 'material-table';
import { Container, CssBaseline } from '@material-ui/core';
import axios from 'axios';
import { connect } from "react-redux";
import { Redirect } from 'react-router';
import ErrorLogin from '../share/error.login';
import {API} from '../share/api';
const API_URL = API + 'customers/list/all/senior/';
class ListCustomerSenior extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { title: 'Id', field: 'customer_id', hidden: true },
                { title: 'Name', field: 'customer_name' },
                { title: 'Email', field: 'customer_email' },
                { title: 'Phone Number', field: 'customer_number_phone' },
                { title: 'Address', field: 'customer_address' },
                { title: 'Director', field: 'user_fullname' },
                { title: 'UserId', field: 'user_id', hidden: true },
            ],
            data: [
            ],
            users: [],
            customer_id: null,
            redirectBillList: false,
            user_fullname: null,
            user_id: 0,
        }
    }
    componentDidMount() {
        axios.get(API_URL+localStorage.getItem('groups_user_id'),{ headers: { Authorization: localStorage.getItem('token') } })
            .then(response => {
                this.setState({ data: response.data.customer });
            })
            .catch(err => console.log(err));
    }
      handleSubmitBillCustomer (event, customer_id, user_id) {
        event.preventDefault();
       this.setState({
           redirectBillList:true,
            customer_id: customer_id,
            user_id: user_id,

       })
      }
    render() {
        const { redirectBillList } = this.state;
        if (redirectBillList) {
            return <Redirect to={'/bill-list-senior/'+this.state.customer_id+ '/'+this.state.user_id}/>;
          }
        if((this.props.isSenior == 'true') || (localStorage.getItem('role_id')==3))
        {
        return (
            <Container component="main" maxWidth="lg">
                <CssBaseline />
                <div style={{ marginTop: '20px' }}>
                    <MaterialTable
                        title='List Customer in My Group '
                        columns={this.state.columns}
                        data={this.state.data}
                        actions={[
                            {
                                icon: 'view_column',
                                tooltip: 'View Bills',
                                onClick: (event, rowData) =>  this.handleSubmitBillCustomer(event,rowData.customer_id,rowData.user_id)
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
        )
    }
    return (
     <ErrorLogin />
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
  export default connect(mapStateToProps) (ListCustomerSenior);