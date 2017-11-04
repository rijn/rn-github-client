import { combineReducers } from 'redux';
import { AsyncStorage } from 'react-native';
import { NavigationActions } from 'react-navigation';

import { AppNavigator, TabNav } from '../navigators/AppNavigator';

/**
 * Set initial navigation to login page
 */
const initialNavState = AppNavigator.router.getStateForAction(
  AppNavigator.router.getActionForPathAndParams('Login')
);

/**
 * Basic navigation reducer
 */
export const nav = (state = initialNavState, action) => {
  let nextState;
  switch (action.type) {
    case 'Login':
      let nextAction = AppNavigator.router.getActionForPathAndParams('Root');
      nextState = AppNavigator.router.getStateForAction(action);
      break;
    case 'UserProfile':
    case 'RepositoryProfile':
    case 'UserRSFF':
    case 'WebView':
    case 'Search':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: action.type, params: action.params }),
        state
      );
      break;
    case 'Logout':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'Login' }),
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

/**
 * Auth reducer
 * Simply one user object currently, will do oauth later
 */
export const auth = (state = initialAuthState, action) => {
  switch (action.type) {
    case 'Login':
      let user = action.params.user;
      AsyncStorage.setItem('@githubClient:user', JSON.stringify(user));
      console.log(user);
      return { ...state, isLoggedIn: true, user };
    case 'Logout':
      AsyncStorage.removeItem('@githubClient:user');
      return { ...state, isLoggedIn: false, user: {} };
    default:
      return state;
  }
}

// Will be combined outside

// const AppReducer = combineReducers({
//   nav,
//   auth,
// });

// export default AppReducer;