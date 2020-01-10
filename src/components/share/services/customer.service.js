import axios from 'axios';
import { API_URL } from "../config";

//function get information current user
export function getCustomerUserCurrent(user_username,token){
    return axios.get(API_URL + 'customers/'+user_username,{ headers: { Authorization: token } } ).then(res => res.data);
}
export function getCustomer(user_username,token){
    return axios.get(API_URL + 'customers/'+user_username,{ headers: { Authorization: token } } ).then(res => res.data);
}
export function getCustomerSearch( text_search,user_username,token){
    return axios.get(API_URL + 'customers/'+user_username+'/search/'+text_search,{ headers: { Authorization: token } } ).then(res => res.data);
}

export function getCustomerPO(customer_id,token){
    return axios.get(API_URL + 'customers/list/po_no/'+customer_id,{ headers: { Authorization: token } } ).then(res => res.data);
}

export function getCustomerForBill(customer_id,token){
    return axios.get(API_URL + 'customers/edit/'+customer_id + '/' + localStorage.getItem('user_id'),{ headers: { Authorization: token } } ).then(res => res.data);
}
export function postCustomerAdd(customer,token){
    return axios.post(API_URL + 'customers/add',customer,{ headers: { Authorization: token } } ).then(res => res.data);
}
export function getCustomerLength(token){
    return axios.get(API_URL + 'customers/length/'+localStorage.getItem('user_id'),{ headers: { Authorization: token } } ).then(res => res.data);
}
export function getCustomerLimit(token){
    return axios.get(API_URL + 'customers/limit/'+localStorage.getItem('user_id'),{ headers: { Authorization: token } } ).then(res => res.data);
}
export function getCustomerEdit(customer_id,token){
    return axios.get(API_URL + 'customers/edit/'+customer_id + '/'+localStorage.getItem('user_id'),{ headers: { Authorization: token } } ).then(res => res.data);
}
export function postCustomerEdit(customer_id,customer,token){
    return axios.post(API_URL + 'customers/edit/'+customer_id ,customer,{ headers: { Authorization: token } } ).then(res => res.data);
}
export function addPOCustomer(customer_id,po,token){
    return axios.post(API_URL + 'customers/add_po_no/'+customer_id ,po,{ headers: { Authorization: token } } ).then(res => res.data);
}
export function updatePOCustomer(po_id,po,token){
    return axios.post(API_URL + 'customers/po_no/'+po_id ,po,{ headers: { Authorization: token } } ).then(res => res.data);
}