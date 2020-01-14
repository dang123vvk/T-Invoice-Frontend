export const loginAction = (user_fullname,user_username,token,role, group) => {
    return {
        type: 'LOGIN',
        user_fullname,
        user_username,
        token,
        role,
        group
    }
  }
  