import axios from 'axios';
import { API_URL } from "../config";


//function get information current user
export function getAccountBankCurrent(token){
    return axios.get(API_URL + 'accountsbank',{ headers: { Authorization: token } } ).then(res => res.data);
}
export function getAccountBankCurrentSearch(text_search, token){
    return axios.get(API_URL + 'accountsbank/search/'+text_search,{ headers: { Authorization: token } } ).then(res => res.data);
}
export function postAccountBank(accountsbank, token){
    return axios.post(API_URL + 'accountsbank/add',accountsbank,{ headers: { Authorization: token } } ).then(res => res.data);
}

export function updateAccountBank(account_bank_id,accountsbank, token){
    return axios.post(API_URL + 'accountsbank/edit/'+account_bank_id,accountsbank,{ headers: { Authorization: token } } ).then(res => res.data);
}

