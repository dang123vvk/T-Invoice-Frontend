import axios from 'axios';
import { API_URL } from "../config";

var user_information = JSON.parse(localStorage.getItem("user_information"));
if(typeof user_information === 'undefined'){
    user_information = {}
}
//function get bill for current user
export function getBillUserCurrent(){
    return axios.get(API_URL + 'bills/list/user/'+user_information.user_username,{ headers: { Authorization: user_information.token } } ).then(res => res.data);
}
//function get bill by id
export function getBill(id){
    return axios.get(API_URL + 'bills/edit/'+ id + '/' +user_information.user_username,{ headers: { Authorization: user_information.token } } ).then(res => res.data);
}
//function get status bill
export function getStatusBill(){
    return axios.get(API_URL + 'bills/status',{ headers: { Authorization: user_information.token } } ).then(res => res.data);
}
//function post  bill
export function postBill(bill){
    return axios.post(API_URL + 'bills/add',bill,{ headers: { Authorization: user_information.token } } ).then(res => res.data);
}