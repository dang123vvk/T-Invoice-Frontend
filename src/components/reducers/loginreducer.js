const loginReducer = (state = { user_fullname: '',user_username: '', token:'',  role: '', group: '' }, action) => {
  switch (action.type) {
      case 'LOGIN':
          return Object.assign({}, state, {
            user_fullname: action.user_fullname,
            user_username: action.user_username,
            token: action.token,
            role: action.role,
            group: action.group
          });
          default:
      return state;
  }
}

export default loginReducer;