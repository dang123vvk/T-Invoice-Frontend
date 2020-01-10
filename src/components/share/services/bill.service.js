import axios from 'axios';
import { API_URL } from "../config";

//function get bill for current user
export function getBillUserCurrent(user_username,token){
    return axios.get(API_URL + 'bills/list/user/'+user_username,{ headers: { Authorization: token } } ).then(res => res.data);
}
//function get bill by id
export function getBillUserCurrentSearch(text_search, user_username,token){
    return axios.get(API_URL + 'bills/list/user/'+user_username+'/search/'+text_search,{ headers: { Authorization: token } } ).then(res => res.data);
}
//function filter
export function getBillUserCurrentFilter(customer_id, status_bill_id, date_start, date_end, user_username, token){
    return axios.get(API_URL + 'bills/list/user/'+ user_username+'/filter/'+customer_id + '/' + status_bill_id+ '/' + date_start+ '/' + date_end,{ headers: { Authorization: token } } ).then(res => res.data);
}
export function getBill(id,user_username, token){
    return axios.get(API_URL + 'bills/edit/'+ id + '/' +user_username,{ headers: { Authorization: token } } ).then(res => res.data);
}
//function get status bill
export function getStatusBill(token){
    return axios.get(API_URL + 'bills/status',{ headers: { Authorization: token } } ).then(res => res.data);
}
//function post  bill
export function postBill(bill, token){
    return axios.post(API_URL + 'bills/add',bill,{ headers: { Authorization: token } } ).then(res => res.data);
}
export function postBillUpdate(id,bill, token){
    return axios.post(API_URL + 'bills/edit/'+id,bill,{ headers: { Authorization: token } } ).then(res => res.data);
}
export function getBillLength(token){
    return axios.get(API_URL + 'bills/list/user/length/'+localStorage.getItem('user_id'),{ headers: { Authorization: token } } ).then(res => res.data);
}
export function getBillSum(token){
    return axios.get(API_URL + 'bills/list/user/sum/'+localStorage.getItem('user_id'),{ headers: { Authorization: token } } ).then(res => res.data);
}
export function getBillNotSendLength(token){
    return axios.get(API_URL + 'bills/list/user/length/notsent/'+localStorage.getItem('user_id'),{ headers: { Authorization: token } } ).then(res => res.data);
}
export function getBillLimit(token){
    return axios.get(API_URL + 'bills/list/user/limit/'+localStorage.getItem('user_id'),{ headers: { Authorization: token } } ).then(res => res.data);
}