import axios from 'axios';
import { API_URL } from "../config";


export function getCurrencies(month,role,token){
    return axios.get(API_URL + 'currencies/month/' + month,{ headers: { Authorization: token, role: role } } ).then(res => res.data);
}
export function getCurrenciesNextMonth(month,role,token){
    return axios.get(API_URL + 'currencies/next/' + month,{ headers: { Authorization: token, role: role } } ).then(res => res.data);
}
export function getId(role,token){
    return axios.get(API_URL + 'currencies/get_id',{ headers: { Authorization: token, role: role } } ).then(res => res.data);
}
export function getCurrenciesSearch(text_search, token){
    return axios.get(API_URL + 'currencies/search/'+text_search,{ headers: { Authorization: token } } ).then(res => res.data);
}
export function postCurrency(currency,role, token){
    return axios.post(API_URL + 'currencies/add',currency,{ headers: { Authorization: token, role: role } } ).then(res => res.data);
}

export function updateCurrency(currency_id,currency,role, token){
    return axios.post(API_URL + 'currencies/edit/'+currency_id,currency,{ headers: { Authorization: token, role: role } } ).then(res => res.data);
}

