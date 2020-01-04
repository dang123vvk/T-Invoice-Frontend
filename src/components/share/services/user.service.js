import axios from 'axios';
import { API_URL } from "../config";

//funtion sign in 
var user_information = JSON.parse(localStorage.getItem("user_information"));
export function signIn(user) {
    return axios.post(API_URL + 'signin', user).then(res => res.data);
}

//function get information current user
export function getInformationCurrent(){
    return axios.get(API_URL + 'users/edit/'+ user_information.user_username,{ headers: { Authorization: user_information.token } } ).then(res => res.data);
}
//function update information current user
export function postInformationCurrent(user_username,user){
    return axios.post(API_URL + 'users/edit/profile/'+ user_username,user,{ headers: { Authorization: user_information.token } }).then(res => res.data);
}