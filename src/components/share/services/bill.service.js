import axios from 'axios';
import { API_URL } from "../config";

var user_information = JSON.parse(localStorage.getItem("user_information"));
if(typeof user_information === 'undefined'){
    user_information = {}
}
//function get information current user
export function getBillUserCurrent(){
    return axios.get(API_URL + 'bills/list/user/'+user_information.user_username,{ headers: { Authorization: user_information.token } } ).then(res => res.data);
}
export function getBillUserCurrentSearch(text_search){
    return axios.get(API_URL + 'bills/list/user/'+user_information.user_username+'/search/'+text_search,{ headers: { Authorization: user_information.token } } ).then(res => res.data);
}
export function getBill(id){
    return axios.get(API_URL + 'bills/edit/'+ id + '/' +user_information.user_username,{ headers: { Authorization: user_information.token } } ).then(res => res.data);
}
export function getStatusBill(){
    return axios.get(API_URL + 'bills/status',{ headers: { Authorization: user_information.token } } ).then(res => res.data);
}