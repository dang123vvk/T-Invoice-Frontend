import axios from 'axios';
import { API_URL } from "../config";

var user_information = JSON.parse(localStorage.getItem("user_information"));
if(typeof user_information === 'undefined'){
    user_information = {}
}
//function get information current user
export function getTemplate(){
    return axios.get(API_URL + 'templates/edit',{ headers: { Authorization: user_information.token } } ).then(res => res.data);
}
export function getTemplateCustomer(customer_id){
    return axios.get(API_URL + 'templates/selectcustomer/'+customer_id,{ headers: { Authorization: user_information.token } } ).then(res => res.data);
}