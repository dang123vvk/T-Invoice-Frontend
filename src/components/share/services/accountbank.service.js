import axios from 'axios';
import { API_URL } from "../config";

var user_information = JSON.parse(localStorage.getItem("user_information"));
if(typeof user_information === 'undefined'){
    user_information = {}
}
//function get information current user
export function getAccountBankCurrent(){
    return axios.get(API_URL + 'accountsbank',{ headers: { Authorization: user_information.token } } ).then(res => res.data);
}
export function postAccountBank(accountsbank){
    return axios.post(API_URL + 'accountsbank/add',accountsbank,{ headers: { Authorization: user_information.token } } ).then(res => res.data);
}