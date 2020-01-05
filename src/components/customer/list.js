import React from 'react';
import MaterialTable from 'material-table';
import { Container, CssBaseline } from '@material-ui/core';
import axios from 'axios';
import { connect } from "react-redux";
import { Redirect } from 'react-router';
import ErrorLogin from '../share/error.login';
import {API} from '../share/api';
const API_URL = API + 'customers/';
class ListCustomer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { title: 'Id', field: 'customer_id', hidden: true },
                { title: 'Name', field: 'customer_name' },
                { title: 'Email', field: 'customer_email' },
                { title: 'Phone Number', field: 'customer_number_phone' },
                { title: 'Address', field: 'customer_address' },
                { title: 'UserId', field: 'customer_details_id', hidden: true },
            ],
            data: [
            ],
            users: [],
            customer_id: null,
            redirect: false,
            redirectBillList: false,
            redirectBillAdd: false,
            redirectAdd: false,
            redirectDetail: false,
        }
    }
    componentDidMount() {
        axios.get(API_URL+localStorage.getItem('user_id'),{ headers: { Authorization: localStorage.getItem('token') } })
            .then(response => {
                //   console.log(JSON.stringify(response.data));
                this.setState({ data: response.data.customers });
            })
            .catch(err => console.log(err));
    }
    handleSubmit (event, customer_id) {
        //   console.log(bill_id);
        event.preventDefault();
       this.setState({
           redirect:true,
            customer_id: customer_id,

       })
      }
      handleSubmitDetail (event, customer_id) {
        //   console.log(bill_id);
        event.preventDefault();
       this.setState({
           redirectDetail:true,
            customer_id: customer_id,

       })
      }
      handleSubmitTempCustomer (event, customer_id) {
        //   console.log(bill_id);
        event.preventDefault();
       this.setState({
           redirectBillList:true,
            customer_id: customer_id,

       })
      }
      handleSubmitBillAdd (event, customer_id) {
        //   console.log(bill_id);
        event.preventDefault();
       this.setState({
           redirectBillAdd:true,
            customer_id: customer_id,

       })
      }
      handleSubmitAdd(event) {
        //   console.log(bill_id);
        event.preventDefault();
        this.setState({
            redirectAdd: true,

        })
    }
    render() {
        const { redirect, redirectBillList,redirectBillAdd, redirectAdd, redirectDetail } = this.state;

        if (redirect) {
          return <Redirect to={'/customer-edit/'+this.state.customer_id}/>;
        }
        if (redirectDetail) {
            return <Redirect to={'/customer-detail/'+this.state.customer_id}/>;
          }
        if (redirectBillList) {
            return <Redirect to={'/customer-template/'+this.state.customer_id}/>;
          }
          if (redirectBillAdd) {
            return <Redirect to={'/bill-add-customer/'+this.state.customer_id}/>;
          }
          if (redirectAdd) {
            return <Redirect to={'/customer/add'}/>;
          }

        if((this.props.isLogin) || (localStorage.getItem('user_name')))
        {
        return (
            <Container component="main" maxWidth="lg">
                <CssBaseline />
                <div style={{ marginTop: '20px' }}>
                    <MaterialTable
                        title='List Customer'
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
                                tooltip: 'Edit Customer',
                                onClick: (event, rowData) =>  this.handleSubmit(event,rowData.customer_id)
                                
                            },
                            {
                                icon: 'view_column',
                                tooltip: 'Detail Customer',
                                onClick: (event, rowData) =>  this.handleSubmitDetail(event,rowData.customer_id)
                                
                            },
                            {
                                icon: 'add',
                                tooltip: 'Add bill',
                                onClick: (event, rowData) =>  this.handleSubmitBillAdd(event,rowData.customer_id)
                                
                            },
                            {
                                icon: 'filter_list',
                                tooltip: 'Customer Template',
                                onClick: (event, rowData) =>  this.handleSubmitTempCustomer(event,rowData.customer_id)
                                
                            },
                            {
                                    icon: 'add',
                                    tooltip: 'Add A Customer',
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
      isLogin: state.loginReducer.isLogin
    };
  }
  export default connect(mapStateToProps) (ListCustomer);