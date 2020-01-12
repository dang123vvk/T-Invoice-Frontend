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
//function get all user by admin
export function getAllUser(role,token){
    return axios.get(API_URL + 'users/role',{ headers: {role: role, Authorization: token } } ).then(res => res.data);
}
export function getUserFromAdmin(user_id,role,token){
    return axios.get(API_URL + 'users/role/'+user_id,{ headers: {role: role, Authorization: token } } ).then(res => res.data);
}
export function postUserFromAdmin(user_id,user,role,token){
    return axios.post(API_URL + 'users/role/'+user_id,user,{ headers: {role: role, Authorization: token } } ).then(res => res.data);
}
//function update information current user
export function postInformationCurrent(user_username,user, token){
    return axios.post(API_URL + 'users/edit/profile/'+ user_username,user,{ headers: { Authorization: token } }).then(res => res.data);
}