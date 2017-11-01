import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';
import gql from 'graphql-tag';
import { mockServer, makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';
import { graphql, ApolloProvider } from 'react-apollo';
import { ApolloClient, createNetworkInterface } from 'apollo-client';
import { mockNetworkInterfaceWithSchema } from 'apollo-test-utils';
import { RepositoryProfileScreen } from '../src/components/RepositoryProfileScreen';

import renderer from 'react-test-renderer';

import configureStore from 'redux-mock-store'

test('renders loading correctly', () => {
  const tree = renderer.create(
    <RepositoryProfileScreen repositoryProfile={{ loading: true }} />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders error correctly', () => {
  const tree = renderer.create(
    <RepositoryProfileScreen repositoryProfile={{ error: new Error('Error test'), loading: false }} />
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

test('renders information correctly', () => {
  let typeDefs = `
      type Repository {
        viewerHasStarred: Boolean
      }

      type Query {
        repository(name: String!, owner: String!): Repository
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
      <RepositoryProfileScreen repositoryProfile={{
        error: null,
        loading: false,
        repository: {
          id: 'test',
          name: 'test',
          updatedAt: 'test',
          createdAt: 'test',
          description: 'test',
          nameWithOwner: 'test',
          url: 'test',
          owner: {
            id: 'test',
            login: 'test',
            avatarUrl: 'test'
          },
          primaryLanguage: {
            name: 'test',
            color: '#ffffff'
          },
          stargazers: { totalCount: 0 },
          forks: { totalCount: 0 },
          watchers: { totalCount: 0 },
          issues: { totalCount: 0 },
          pullRequests: { totalCount: 0 },
          isFork: false,
          parent: {
            nameWithOwner: 'test'
          },
          licenseInfo: {
            name: 'test',
            nickname: 'test'
          }
        }
      }} />
    </ApolloProvider>
  ).toJSON();
  expect(tree).toMatchSnapshot();
});