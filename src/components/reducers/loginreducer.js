const loginReducer = (state = { username: '', password: '', token:'', isLogin: false, isAdmin: false, isSenior: false }, action) => {
  switch (action.type) {
      case 'LOGIN':
          return Object.assign({}, state, {
              username: action.username,
              password: action.password,
              token: action.token,
              isLogin: action.isLogin,
              isAdmin: action.isAdmin,
              isSenior: action.isSenior
          });
          default:
      return state;
  }
}

export default loginReducer;