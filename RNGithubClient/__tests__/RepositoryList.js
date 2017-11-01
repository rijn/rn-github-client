import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';
import gql from 'graphql-tag';
import { mockServer, makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { graphql, ApolloProvider } from 'react-apollo';
import { ApolloClient, createNetworkInterface } from 'apollo-client';
import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils';
import { RepositoryList } from '../src/components/RepositoryList';

import renderer from 'react-test-renderer';

import configureStore from 'redux-mock-store'

test('renders loading correctly', () => {
  const tree = renderer.create(
    <RepositoryList repo={{ loading: true }} />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders information correctly', () => {
  let component = renderer.create(
    <RepositoryList repos={{}} />
  );
  component.props = {
    repository: {
      edges: [{
        node: {
          id: 'test'
        }
      }]
    }
  };
  expect(component.toJSON()).toMatchSnapshot();
});