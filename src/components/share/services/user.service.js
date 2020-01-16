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
export function getAllUserGroup(group,role,token){
    return axios.get(API_URL + 'users/role/senior/group/'+group,{ headers: {role: role, Authorization: token } } ).then(res => res.data);
}

export function getAllUserGroupAdmin(group,role,token){
    return axios.get(API_URL + 'users/role/admin/group/'+group,{ headers: {role: role, Authorization: token } } ).then(res => res.data);
}
export function getUserFromAdmin(user_id,role,token){
    return axios.get(API_URL + 'users/role/'+user_id,{ headers: {role: role, Authorization: token } } ).then(res => res.data);
}
export function getDirectorFromSenior(user_id,role,token){
    return axios.get(API_URL + 'users/role/senior/'+user_id,{ headers: {role: role, Authorization: token } } ).then(res => res.data);
}
export function getUserFromSeniorSearch(group,text_search,role,token){
    return axios.get(API_URL + 'users/role/senior/search/'+group +'/'+text_search,{ headers: {role: role, Authorization: token } } ).then(res => res.data);
}
export function getUserFromAdminGroupSearch(group,text_search,role,token){
    return axios.get(API_URL + 'users/role/admin/search/'+group +'/'+text_search,{ headers: {role: role, Authorization: token } } ).then(res => res.data);
}
export function getUserFromAdminSearch(text_search,role,token){
    return axios.get(API_URL + 'users/role/search/'+text_search,{ headers: {role: role, Authorization: token } } ).then(res => res.data);
}
export function postDirectorFromSenior(user_id,user,role,token){
    return axios.post(API_URL + 'users/role/senior/'+user_id,user,{ headers: {role: role, Authorization: token } } ).then(res => res.data);
}
export function postUserFromAdmin(user_id,user,role,token){
    return axios.post(API_URL + 'users/role/'+user_id,user,{ headers: {role: role, Authorization: token } } ).then(res => res.data);
}
export function postAddUserFromSenior(user,role,token){
    return axios.post(API_URL + 'users/role/senior/add',user,{ headers: {role: role, Authorization: token } } ).then(res => res.data);
}
export function postAddUserFromAdmin(user,role,token){
    return axios.post(API_URL + 'users/roles/add',user,{ headers: {role: role, Authorization: token } } ).then(res => res.data);
}
//function update information current user
export function postInformationCurrent(user_username,user, token){
    return axios.post(API_URL + 'users/edit/profile/'+ user_username,user,{ headers: { Authorization: token } }).then(res => res.data);
}