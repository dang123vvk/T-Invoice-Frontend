import thunk from 'redux-thunk';
import loginReducer from './loginreducer'
import { combineReducers, createStore, applyMiddleware } from 'redux'

const AppReducers = combineReducers({
  loginReducer,
});
const rootReducer = (state, action) => {
  return AppReducers(state, action);
}
let store = createStore(rootReducer, applyMiddleware(thunk));
export default store;