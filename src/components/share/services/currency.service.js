import axios from 'axios';
import { API_URL } from "../config";


export function getCurrencies(month,role,token){
    return axios.get(API_URL + 'currencies/month/' + month,{ headers: { Authorization: token, role: role } } ).then(res => res.data);
}
export function getCurrenciesSearch(text_search, token){
    return axios.get(API_URL + 'accountsbank/search/'+text_search,{ headers: { Authorization: token } } ).then(res => res.data);
}
export function postCurrency(accountsbank, token){
    return axios.post(API_URL + 'accountsbank/add',accountsbank,{ headers: { Authorization: token } } ).then(res => res.data);
}

export function updateCurrency(account_bank_id,accountsbank, token){
    return axios.post(API_URL + 'accountsbank/edit/'+account_bank_id,accountsbank,{ headers: { Authorization: token } } ).then(res => res.data);
}

