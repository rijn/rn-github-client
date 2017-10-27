import React from 'react';
import { AppRegistry, AsyncStorage } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';

import * as AppReducer from './reducers';
import AppWithNavigationState from './navigators/AppNavigator';

import { graphql, ApolloProvider } from 'react-apollo';
import { ApolloClient, createNetworkInterface } from 'apollo-client';
import gql from 'graphql-tag';

const networkInterface = createNetworkInterface({ uri: 'https://api.github.com/graphql' });
const client = new ApolloClient({ networkInterface });

/**
 * Pass token when calling api
 */
networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};
    }

    AsyncStorage.getItem('@githubClient:user').then((user) => {
      if (user) {
        req.options.headers.authorization = `Bearer ` + JSON.parse(user).token;
      }
      next();
    });
  }
}]);

/**
 * Main Application
 */
export default class App extends React.Component {
  /**
   * Combine reducer and initialize redux store
   */
  store = createStore(combineReducers({
    ...AppReducer,
    apollo: client.reducer(),
  }),
  {},
  compose(
      applyMiddleware(client.middleware())
  ));

  /**
   * Render function
   * @return {ReactDOM}
   */
  render() {
    return (
      <ApolloProvider client={client} store={this.store}>
        <AppWithNavigationState />
      </ApolloProvider>
    );
  }
};