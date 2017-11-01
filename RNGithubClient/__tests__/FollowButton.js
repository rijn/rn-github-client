import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';
import gql from 'graphql-tag';
import { mockServer, makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { graphql, ApolloProvider } from 'react-apollo';
import { ApolloClient, createNetworkInterface } from 'apollo-client';
import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils';
import { FollowButton } from '../src/components/FollowButton';

import renderer from 'react-test-renderer';

import configureStore from 'redux-mock-store'

test('renders loading correctly', () => {
  const tree = renderer.create(
    <FollowButton login='test' data={{
      loading: true,
      login: 'test'
    }} />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders cannot follow correctly', () => {
  let tree = renderer.create(
    <FollowButton login='test' data={{
      loading: false,
      user: {
        viewerCanFollow: false,
        viewerIsFollowing: false
      }
    }} />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders can follow correctly', () => {
  let tree = renderer.create(
    <FollowButton login='test' data={{
      loading: false,
      user: {
        viewerCanFollow: true,
        viewerIsFollowing: false
      }
    }} />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders is following correctly', () => {
  let tree = renderer.create(
    <FollowButton login='test' data={{
      loading: false,
      user: {
        viewerCanFollow: true,
        viewerIsFollowing: true
      }
    }} />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});