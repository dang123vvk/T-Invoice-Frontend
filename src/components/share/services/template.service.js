import axios from 'axios';
import { API_URL } from "../config";

//function get information current user
export function getTemplate(token){
    return axios.get(API_URL + 'templates/edit',{ headers: { Authorization: token } } ).then(res => res.data);
}
export function getTemplateBill(id,token){
    return axios.get(API_URL + 'templates/select/'+id,{ headers: { Authorization: token } } ).then(res => res.data);
}
export function getTemplateCustomer(customer_id,token){
    return axios.get(API_URL + 'templates/selectcustomer/'+customer_id,{ headers: { Authorization: token } } ).then(res => res.data);
}