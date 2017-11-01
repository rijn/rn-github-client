import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';
import gql from 'graphql-tag';
import { mockServer, makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { graphql, ApolloProvider } from 'react-apollo';
import { ApolloClient, createNetworkInterface } from 'apollo-client';
import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils';
import { StarButton } from '../src/components/StarButton';

import renderer from 'react-test-renderer';

import configureStore from 'redux-mock-store'

test('renders loading correctly', () => {
  const tree = renderer.create(
    <StarButton owner='test' name='test' data={{
      loading: true,
    }} />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders has not starred correctly', () => {
  let tree = renderer.create(
    <StarButton owner='test' name='test' data={{
      loading: false,
      repository: {
        viewerHasStarred: false
      }
    }} />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders has starred correctly', () => {
  let tree = renderer.create(
    <StarButton owner='test' name='test' data={{
      loading: false,
      repository: {
        viewerHasStarred: true
      }
    }} />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});