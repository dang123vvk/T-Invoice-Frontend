import axios from 'axios';
import { API_URL } from "../config";

//funtion sign in 

export function signIn(user) {
    return axios.post(API_URL + 'signin', user).then(res => res.data);
}

//function get information current user
export function getInformationCurrent(user_username,token){
    return axios.get(API_URL + 'users/edit/'+ user_username,{ headers: { Authorization: token } } ).then(res => res.data);
}
//function update information current user
export function postInformationCurrent(user_username,user, token){
    return axios.post(API_URL + 'users/edit/profile/'+ user_username,user,{ headers: { Authorization: token } }).then(res => res.data);
}