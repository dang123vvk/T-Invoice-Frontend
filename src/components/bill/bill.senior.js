import React from 'react';
import MaterialTable from 'material-table';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import axios from 'axios';
import { Redirect } from 'react-router'
import { connect } from "react-redux";
import { API } from '../share/api';
import ErrorLogin from '../share/error.login';
const API_URL = API + 'bills/list/all/senior/';
class ListBillAllSenior extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { title: 'Bill ID', field: 'bill_id', hidden: true },
                { title: 'Monthly', field: 'bill_monthly_cost' },
                { title: 'Customer', field: 'customer_name' },
                { title: 'Status', field: 'status_bill_name' },
                { title: 'Sum', field: 'bills_sum', type: 'numeric' },
                { title: 'People Enter The Bill', field: 'user_fullname' },
                { title: 'Date', field: 'bill_date' },
            ],
            data: [
            ],
            bill_id: null,
            reactDetail: false,
            customer_name: '',
        }
    }
    componentDidMount() {
        axios.get(API_URL + localStorage.getItem('groups_user_id'), { headers: { Authorization: localStorage.getItem('token') } })
            .then(response => {
                this.setState({
                    data: response.data.bill,
                });
            })
            .catch(err => console.log(err));
    }
    handleSubmitExport(event, bill_id) {
        event.preventDefault();
        this.setState({
            reactDetail: true,
            bill_id: bill_id,
        })
    }
    render() {
        const { reactDetail } = this.state;
        if (reactDetail) {
            return <Redirect to={'/bill-detail-senior/' + this.state.bill_id} />;
        }
        if ((this.props.isSenior == 'true') || (localStorage.getItem('role_id') == 3)) {
            return (
                <Container component="main">
                    <CssBaseline />
                    <div style={{ marginTop: '20px' }}>
                        <MaterialTable
                            title="List Bill in My Group" 
                            columns={this.state.columns}
                            data={this.state.data}
                            actions={[
                                {
                                    icon: 'save_alt',
                                    tooltip: 'Export',
                                    onClick: (event, rowData) => this.handleSubmitExport(event, rowData.bill_id)
                                },

                            ]}
                            options={{
                                search: true,
                                exportButton: true,
                                exportAllData: true,
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
        isLogin: state.loginReducer.isLogin,
        isSenior: state.loginReducer.isSenior
    };
}
export default connect(mapStateToProps)(ListBillAllSenior);