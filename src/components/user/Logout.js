import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { loginAction } from '../reducers/action';
class Logout extends Component
  { 
    constructor(props) {
      super(props);
      this.state = {}
      this.logout = this.logout.bind(this);
  }
  logout(){
      localStorage.removeItem('user_information');
      localStorage.removeItem('user_id');
      this.props.login('','','','');
  }
render()
{
  return (
      <div>
          <Button color="inherit" onClick={this.logout}>Log out</Button>
      </div>
  )
}
}
const mapStateToProps = state => {
  return {
    title: state.loginReducer.username,
    isLogin: state.loginReducer.isLogin
  };
};
const mapDispatchToProps = (dispatch) => ({
    login: (user_fullname,user_username,token, role) => dispatch(loginAction(user_fullname,user_username, token,role))
   });
export default connect(mapStateToProps, mapDispatchToProps) (Logout) ;