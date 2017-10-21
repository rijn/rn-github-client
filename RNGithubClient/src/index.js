import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';

import * as AppReducer from './reducers';
import AppWithNavigationState from './navigators/AppNavigator';

import { graphql, ApolloProvider } from 'react-apollo';
import { ApolloClient, createNetworkInterface } from 'apollo-client';
import gql from 'graphql-tag';

const TOKEN = 'e17862053e9dff5e41a86e7fbba38334e47fb8bc';

const networkInterface = createNetworkInterface({ uri: 'https://api.github.com/graphql' });
const client = new ApolloClient({ networkInterface });

networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};
    }

    req.options.headers.authorization = `Bearer ${TOKEN}`;

    next();
  }
}]);

console.log(networkInterface);

export default class App extends React.Component {
  store = createStore(combineReducers({
    ...AppReducer,
    apollo: client.reducer(),
  }),
  {},
  compose(
      applyMiddleware(client.middleware())
  ));

  render() {
    return (
      <ApolloProvider client={client} store={this.store}>
        <AppWithNavigationState />
      </ApolloProvider>
    );
  }
};