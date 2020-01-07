import axios from 'axios';
import { API_URL } from "../config";

var user_information = JSON.parse(localStorage.getItem("user_information"));
if(typeof user_information === 'undefined'){
    user_information = {}
}
//function get information current user
export function getCustomerUserCurrent(){
    return axios.get(API_URL + 'customers/'+user_information.user_username,{ headers: { Authorization: user_information.token } } ).then(res => res.data);
}
export function getCustomer(){
    return axios.get(API_URL + 'customers/'+user_information.user_username,{ headers: { Authorization: user_information.token } } ).then(res => res.data);
}
export function getCustomerPO(customer_id){
    return axios.get(API_URL + 'customers/list/po_no/'+customer_id,{ headers: { Authorization: user_information.token } } ).then(res => res.data);
}
export function postAccountBank(accountsbank){
    return axios.post(API_URL + 'customers/add',accountsbank,{ headers: { Authorization: user_information.token } } ).then(res => res.data);
}