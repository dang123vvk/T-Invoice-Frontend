import React from 'react';
import MaterialTable from 'material-table';
import { Container, CssBaseline} from '@material-ui/core';
import axios from 'axios';
import { connect } from "react-redux";
import { Redirect } from 'react-router';
import { API } from '../share/api';
import ErrorAdmin from '../share/error.admin';
const API_URL2 = API + 'groups/delete/';
const API_URL = API + 'groups/';
class ListCustomer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { title: 'Id', field: 'groups_user_id', hidden: true },
                { title: ' Group Name', field: 'groups_user_name' },
                { title: 'Group Description', field: 'groups_user_description' }, 
            ],
            data: [
            ],
            users: [],
            groups_user_id: null,
            redirect: false,
            redirectUserGroup: false,
            redirectBillAdd: false,
            redirectAdd: false,
        }
    }
    componentDidMount() {
        axios.get(API_URL,{ headers: { Authorization: localStorage.getItem('token') } })
            .then(response => {
                this.setState({ data: response.data.group });
            })
            .catch(err => console.log(err));
    }
    handleSubmit (event, groups_user_id) {
        event.preventDefault();
       this.setState({
           redirect:true,
           groups_user_id: groups_user_id,

       })
      }
      handleSubmitUserGroup (event, groups_user_id) {
        event.preventDefault();
       this.setState({
        redirectUserGroup:true,
           groups_user_id: groups_user_id,

       })
      }
      handleSubmitBillAdd (event, customer_id) {
        event.preventDefault();
       this.setState({
           redirectBillAdd:true,
            customer_id: customer_id,

       })
      }
      handleSubmitAdd(event) {
        event.preventDefault();
        this.setState({
            redirectAdd: true,

        })
    }
    render() {
        const { redirect, redirectUserGroup,redirectBillAdd, redirectAdd } = this.state;

        if (redirect) {
          return <Redirect to={'/group-edit/'+this.state.groups_user_id}/>;
        }
        if (redirectUserGroup) {
            return <Redirect to={'/user-group/'+this.state.groups_user_id}/>;
          }
          if (redirectBillAdd) {
            return <Redirect to={'/bill-add-customer/'+this.state.customer_id}/>;
          }
          if (redirectAdd) {
            return <Redirect to={'/group-add'}/>;
          }

          if ((((this.props.isLogin)  &&  (localStorage.getItem('role_id')==1))) || ((localStorage.getItem('user_name')) &&  (localStorage.getItem('role_id')==1)))
          {
        return (
            <Container component="main" maxWidth="lg">
                <CssBaseline />
                <div style={{ marginTop: '20px' }}>
                    <MaterialTable
                        title='List Group'
                        columns={this.state.columns}
                        data={this.state.data}
                        editable={{
                            onRowDelete: oldData =>
                                new Promise((resolve, reject) => {
                                    setTimeout(() => {
                                        {
                                            let data = this.state.data;
                                            const index = data.indexOf(oldData);
                                            axios.get(API_URL2 + data[index].groups_user_id, { headers: { Authorization: localStorage.getItem('token') } })
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
                                tooltip: 'Edit Group',
                                onClick: (event, rowData) =>  this.handleSubmit(event,rowData.groups_user_id)
                                
                            },
                           
                            {
                                icon: 'view_column',
                                tooltip: 'View User',
                                onClick: (event, rowData) =>  this.handleSubmitUserGroup(event,rowData.groups_user_id)
                                
                            },
                            {
                                    icon: 'add',
                                    tooltip: 'Add Group',
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
  export default connect(mapStateToProps) (ListCustomer);