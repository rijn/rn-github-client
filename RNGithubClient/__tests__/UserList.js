import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';
import gql from 'graphql-tag';
import { mockServer, makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { graphql, ApolloProvider } from 'react-apollo';
import { ApolloClient, createNetworkInterface } from 'apollo-client';
import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils';
import { UserList } from '../src/components/UserList';

import renderer from 'react-test-renderer';

import configureStore from 'redux-mock-store'

test('renders loading correctly', () => {
  const tree = renderer.create(
    <UserList followers={{ loading: true }} />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders information correctly', () => {
  let component = renderer.create(
    <UserList followers={{}} />
  );
  component.props = {
    followers: {
      edges: [{
        node: {
          id: 'test'
        }
      }]
    }
  };
  expect(component.toJSON()).toMatchSnapshot();
});