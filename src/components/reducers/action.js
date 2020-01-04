export const loginAction = (user_fullname,user_username,token,role) => {
    return {
        type: 'LOGIN',
        user_fullname,
        user_username,
        token,
        role
    }
  }
  