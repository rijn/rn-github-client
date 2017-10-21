import { combineReducers } from 'redux';
import { AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation';

import { AppNavigator, TabNav } from '../navigators/AppNavigator';

const initialNavState = AppNavigator.router.getStateForAction(
  AppNavigator.router.getActionForPathAndParams('Login')
);

export const nav = (state = initialNavState, action) => {
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
    case 'UserRSFF':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'UserRSFF', params: action.params }),
        state
      );
      break;
    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }

  return nextState || state;
}

const initialAuthState = { isLoggedIn: false, user: null };

export const auth = (state = initialAuthState, action) => {
  switch (action.type) {
    case 'Login':
      let user = action.params.user;
      AsyncStorage.setItem('@githubClient:user', user);
      return { ...state, isLoggedIn: true, user };
    default:
      return state;
  }
}

// const AppReducer = combineReducers({
//   nav,
//   auth,
// });

// export default AppReducer;