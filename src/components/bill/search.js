import React from 'react';
import MaterialTable from 'material-table';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import axios from 'axios';
import { Redirect } from 'react-router'
import { connect } from "react-redux";
import { API } from '../share/api';
import ErrorLogin from '../share/error.login';
import {
    ExcelExport,
    ExcelExportColumn,
    ExcelExportColumnGroup
} from '@progress/kendo-react-excel-export';
import {month} from '../share/month';
const API_URL = API + 'bills/search/';
const API_URL2 = API + 'bills/delete/';
class SearchBill extends React.Component {
    _exporter;
    export = () => {
        this._exporter.save();
    }
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { title: 'Bill ID', field: 'bill_id', hidden: true },
                { title: 'Month', field: 'month' },
                { title: 'Monthly', field: 'bill_monthly_cost', hidden: true },
                { title: 'Customer', field: 'customer_name' },
                { title: 'Status', field: 'status_bill_name' },
                { title: 'Sum', field: 'bills_sum', type: 'numeric' },
                { title: 'Date', field: 'bill_date' },
            ],
            data: [],
            redirect: false,
            bill_id: null,
            redirectAdd: false,
            reactDetail: false,
        }
    }
    componentDidMount() {
        axios.get(API_URL + localStorage.getItem('user_id') + '/'+ this.props.match.params.customer_name+ '/'+ this.props.match.params.status_id + '/'+this.props.match.params.date_from+'/'+this.props.match.params.date_to, { headers: { Authorization: localStorage.getItem('token') } })
            .then(response => {
                this.setState({ data: response.data.bill });
            })
            .catch(err => console.log(err));
    }
    handleSubmit(event, bill_id) {
        event.preventDefault();
        this.setState({
            redirect: true,
            bill_id: bill_id,
        })
    }
    handleSubmitExport(event, bill_id) {
        event.preventDefault();
        this.setState({
            reactDetail: true,
            bill_id: bill_id,
        })
    }
    handleSubmitAdd(event) {
        event.preventDefault();
        this.setState({
            redirectAdd: true,
        })
    }
    handleSubmitExportExcel(event,data) {
        console.log(JSON.stringify(data.length));
        event.preventDefault();
        this._exporter.save();
    }
    render() {
        this.state.data.map((key,index)=>{
            key.in = index +1;
            key.month= month(key.bill_monthly_cost.slice(5,7)) + " " + key.bill_monthly_cost.slice(0,4);
        });
        const { redirect, redirectAdd, reactDetail } = this.state;

        if (redirect) {
            return <Redirect to={'/bill-edit/' + this.state.bill_id} />;
        }
        if (reactDetail) {
            return <Redirect to={'/bill-detail/' + this.state.bill_id} />;
        }
        if (redirectAdd) {
            return <Redirect to={'/bill-add/'} />;
        }
        if ((this.props.isLogin) || (localStorage.getItem('user_name'))) {
            return (
                <Container component="main">
                    <CssBaseline />
                    <div style={{ marginTop: '20px' }}>
                        <MaterialTable
                            title={'About ' + this.state.data.length + ' results'} 
                            columns={this.state.columns}
                            data={this.state.data}
                            editable={{
                                onRowDelete: oldData =>
                                    new Promise((resolve, reject) => {
                                        setTimeout(() => {
                                            {
                                                let data = this.state.data;
                                                const index = data.indexOf(oldData);
                                                axios.get(API_URL2 + data[index].bill_id, { headers: { Authorization: localStorage.getItem('token') } })
                                                    .then(response => {
                                                        //this.setState({ data: response.data.accountsbank });
                                                    })
                                                    .catch(err => console.log(err));
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
                                    tooltip: 'Edit Bill',
                                    onClick: (event, rowData) => this.handleSubmit(event, rowData.bill_id)
                                },
                                {
                                    icon: 'save_alt',
                                    tooltip: 'Export',
                                    onClick: (event, rowData) => this.handleSubmitExport(event, rowData.bill_id)

                                },
                                {
                                    icon: 'add',
                                    tooltip: 'Add Bill',
                                    isFreeAction: true,
                                    onClick: (event) => this.handleSubmitAdd(event)
                                },   
                            ]}
                            options={{
      search: true,
      exportButton: true,
      exportAllData:true,
    }}
                        />
                    </div>
                    <ExcelExport
                        data={this.state.data}
                        fileName="abc.xlsx"
                        ref={(exporter) => { this._exporter = exporter; }}
                    >
                        <ExcelExportColumnGroup title="List Bill" headerCellOptions={{ background: '#2196f3', textAlign: 'center' }}>
                            <ExcelExportColumn title="#" field="in" width={100} cellOptions={{
                                textAlign: 'center'
                            }} />
                            <ExcelExportColumn title="Month" field="month" width={200} cellOptions={{
                                textAlign: 'center'
                            }} />
                            <ExcelExportColumn title="Customer" field="customer_name" width={200} cellOptions={{
                                textAlign: 'center'
                            }} />
                            <ExcelExportColumn title="Status" field="status_bill_name" width={200} cellOptions={{
                                textAlign: 'center'
                            }} />
                            <ExcelExportColumn title="Sum" field="bills_sum" width={200} cellOptions={{
                                textAlign: 'center'
                            }} />
                            <ExcelExportColumn title="People Enter The Bill" field="user_username" width={250} cellOptions={{
                                textAlign: 'center'
                            }} />
                            <ExcelExportColumn title="Date" field="bill_date" width={200} cellOptions={{
                                textAlign: 'center'
                            }} />
                        </ExcelExportColumnGroup>
                    </ExcelExport>
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
export default connect(mapStateToProps)(SearchBill);