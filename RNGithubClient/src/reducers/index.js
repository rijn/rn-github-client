import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';

import { AppNavigator, TabNav } from '../navigators/AppNavigator';

const initialNavState = AppNavigator.router.getStateForAction(
  AppNavigator.router.getActionForPathAndParams('Login')
);


function nav(state = initialNavState, action) {
  let nextState;
  switch (action.type) {
    case 'Login':
      let nextAction = AppNavigator.router.getActionForPathAndParams('Root');
      nextState = AppNavigator.router.getStateForAction(action);
      break;
    case 'UserProfile':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'UserProfile', params: action.params }),
        state
      );
      break;
    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
}

const initialAuthState = { isLoggedIn: false };

function auth(state = initialAuthState, action) {
  switch (action.type) {
    case 'Login':
      return { ...state, isLoggedIn: true };
    default:
      return state;
  }
}

const AppReducer = combineReducers({
  nav,
  auth,
});

export default AppReducer;