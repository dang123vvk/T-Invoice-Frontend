import React from 'react';
import MaterialTable from 'material-table';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import axios from 'axios';
import { Redirect } from 'react-router'
import { connect } from "react-redux";
import {API} from '../share/api';
import ErrorLogin from '../share/error.login';
const API_URL = API + 'bills/list/customer/';
const API_URL2 = API + 'bills/delete/';
class ListBillCustomer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { title: 'Bill ID', field: 'bill_id' ,hidden : true},
                { title: 'Monthly', field: 'bill_monthly_cost' },
                { title: 'Customer', field: 'customer_name' },
                { title: 'Status', field: 'status_bill_name' },
                { title: 'Sum', field: 'bills_sum',type: 'numeric' },
                { title: 'Date', field: 'bill_date' },
            ],
            data: [],
            redirect: false,
            bill_id: null,
            reactDetail: false,
            customer_name: '',
        }
      }
    componentDidMount() {
        axios.get(API_URL+this.props.match.params.id + '/'+ localStorage.getItem('user_id'),{ headers: { Authorization: localStorage.getItem('token') } })
        .then(response => {
            this.setState({ 
                data: response.data.bill,
                customer_name: response.data.customer.customer_name
             });
        })
        .catch(err => console.log(err));
      }
      handleSubmitExport (event, bill_id) {
        event.preventDefault();
       this.setState({
           reactDetail:true,
           bill_id: bill_id,
       })
      }
      handleSubmit (event, bill_id) {
        event.preventDefault();
       this.setState({
           redirect:true,
           bill_id: bill_id,
       })
      }
    render() {
        const { redirect , reactDetail } = this.state;
        if (redirect) {
          return <Redirect to={'/bill-edit/'+this.state.bill_id}/>;
        }
        if (reactDetail) {
            return <Redirect to={'/bill-detail/'+this.state.bill_id}/>;
          }
        if((this.props.isLogin) || (localStorage.getItem('user_name')))
        {
    return (  
        <Container component="main">
            <CssBaseline />
            <div style={{marginTop: '20px'}}>
                <MaterialTable
                    title={"List Bill of " + this.state.customer_name}
                    columns={this.state.columns}
                    data={this.state.data}
                    editable={{
                        onRowDelete: oldData =>
                            new Promise(resolve => {
                                setTimeout(() => {
                                    resolve();
                                    const data = [...this.state.data];
                                    const index=data.indexOf(oldData);
                                    axios.get(API_URL2 + data[index].bill_id, { headers: { Authorization: localStorage.getItem('token') } })
                                        .then(response => {
                                        })
                                        .catch(err => console.log(err));
                                    data.splice(index, 1);
                                    this.setState({ ...this.state, data });
                                }, 600);
                            }),
                    }}
                    actions={[
                        {
                            icon: 'edit',
                            tooltip: 'Edit Bill',
                            onClick: (event, rowData) =>  this.handleSubmit(event,rowData.bill_id)
                        },
                        {
                            icon: 'save_alt',
                            tooltip: 'Export',
                            onClick: (event, rowData) =>  this.handleSubmitExport(event,rowData.bill_id) 
                        },
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
  export default connect(mapStateToProps) (ListBillCustomer);