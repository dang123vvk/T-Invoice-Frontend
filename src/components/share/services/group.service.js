import axios from 'axios';
import { API_URL } from "../config";


//function get information current user
export function getGroupFromAdmin(role,token){
    return axios.get(API_URL + 'users/groups',{ headers: { Authorization: token , role: role} } ).then(res => res.data);
}
export function getRoleFromAdmin(role,token){
    return axios.get(API_URL + 'users/roles',{ headers: { Authorization: token , role: role} } ).then(res => res.data);
}
export function getDashboardSenior(group_id,role,token){
    return axios.get(API_URL + 'groups/senior/'+ group_id,{ headers: { Authorization: token , role: role} } ).then(res => res.data);
}
export function postGroupAdd(group,role,token){
    return axios.post(API_URL + 'groups/add',group,{ headers: { Authorization: token , role: role} } ).then(res => res.data);
}
export function getGroupEdit(group_id,role,token){
    return axios.get(API_URL + 'groups/edit/'+ group_id,{ headers: { Authorization: token , role: role} } ).then(res => res.data);
}
export function postGroupUpdate(group_id,group,role,token){
    return axios.post(API_URL + 'groups/edit/'+ group_id,group,{ headers: { Authorization: token , role: role} } ).then(res => res.data);
}

