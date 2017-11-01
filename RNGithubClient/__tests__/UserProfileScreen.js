import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';
import gql from 'graphql-tag';
import { mockServer, makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { graphql, ApolloProvider } from 'react-apollo';
import { ApolloClient, createNetworkInterface } from 'apollo-client';
import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils';
import { UserProfileScreen } from '../src/components/UserProfileScreen';

import renderer from 'react-test-renderer';

import configureStore from 'redux-mock-store'

test('renders loading correctly', () => {
  const tree = renderer.create(
    <UserProfileScreen userProfile={{ loading: true }} />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders error correctly', () => {
  const tree = renderer.create(
    <UserProfileScreen userProfile={{ error: new Error('Error test'), loading: false }} />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders information correctly', () => {
  let typeDefs = `
      type User {
        viewerCanFollow: Boolean
        viewerIsFollowing: Boolean
      }

      type Query {
        user(login: String!): User
      }
    `;
  let schema = makeExecutableSchema({ typeDefs });
  addMockFunctionsToSchema({ schema });
  let server = mockServer(schema, {
    User: () => ({ viewerCanFollow: true, viewerIsFollowing: false }),
  });
  let store = configureStore()({})
  let networkInterface = mockNetworkInterfaceWithSchema({ schema, server });
  let client = new ApolloClient({ networkInterface });
  let tree = renderer.create(
    <ApolloProvider store={store} client={client}>
      <UserProfileScreen userProfile={{
        error: null,
        loading: false,
        user: {
          login: 'test',
          name: 'test',
          avatarUrl: 'test',
          bio: 'test',
          location: 'test',
          company: 'test',
          websiteUrl: 'test',
          email: 'test',
          createdAt: 'test',
          followers: { totalCount: 0 },
          following: { totalCount: 0 },
          repositories: { totalCount: 0 },
          starredRepositories: { totalCount: 0 },
          organizations: {
            nodes: [{
              id: 'test',
              name: 'test',
              avatarUrl: 'test'
            }]
          }
        }
      }} />
    </ApolloProvider>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});