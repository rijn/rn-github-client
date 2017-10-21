import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StyleSheet, View, FlatList, Dimensions } from 'react-native';
import { Container, Content, Separator, List, ListItem, Text, Left, Body, Right, Thumbnail, Button } from 'native-base';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: height - 64 - 50
  },
  inline: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  ceil: {
    marginRight: 10
  }
});

class RepositoryList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      composed: null
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.loading) return;

    let composed = newProps.repos ? newProps.repos : null;

    this.setState({ composed });

    this.props = newProps;
  }

  primaryLanguageView(primaryLanguage) {
    if (!primaryLanguage) return;
    let { name: primaryLanguageName, color: primaryLanguageColor } = primaryLanguage;
    return (
      <View style={[ styles.inline, styles.ceil ]}>
        <View style={{
          width: 7, height: 7, borderRadius: 7,
          marginRight: 5,
          backgroundColor: primaryLanguageColor
        }}></View>
        <Text note>{primaryLanguageName}</Text>
      </View>
    );
  }

  render() {
    let { dispatch } = this.props;

    let composed = this.state.composed;

    if (!composed) {
      return (
        <Text>Loading</Text>
      );
    }

    let repositoryList = _.chain(composed.repository.edges).map(({ node }) => node).value();

    return (
      <List scrollEnabled={false} style={styles.container}>
        <FlatList
          data={repositoryList}
          onEndReached={() => { if (!this.props.loading) { return composed.fetchNextPage(); } }}
          keyExtractor={({ id }) => id}
          renderItem={({
            item: {
              id, name, description, isFork,
              parent,
              primaryLanguage,
              updatedAt,
              stargazers: { totalCount: stars },
              forks: { totalCount: forks }
            }
          }) => (
            <ListItem onPress={() => dispatch({ type: 'RepositoryProfile', params: { user: { login } } })}>
              <View>
                <View style={styles.inline}>
                  <Text>{name}</Text>
                  {isFork && <Text note>{parent.nameWithOwner}</Text>}
                </View>
                <View style={[ styles.inline, { marginTop: 5 } ]}>
                  <Text note>{description}</Text>
                </View>
                <View style={[ styles.inline, { marginTop: 5 } ]}>
                  {this.primaryLanguageView(primaryLanguage)}
                  <View style={[ styles.inline, styles.ceil ]}>
                    <Ionicons name='ios-star-outline' style={{ marginRight: 5 }} />
                    <Text note>{stars}</Text>
                  </View>
                  <View style={[ styles.inline, styles.ceil ]}>
                    <Ionicons name='ios-git-network-outline' style={{ marginRight: 5 }} />
                    <Text note>{forks}</Text>
                  </View>
                  <Text note>Updated at {new Date(updatedAt).toLocaleDateString()}</Text>
                </View>
              </View>
            </ListItem>
          )}
        />
      </List>
    );
  }
};

RepositoryList.propTypes = {
  user: PropTypes.string.isRequired,
  enableRepos: PropTypes.bool.isRequired
};

const GetReposQuery = gql`
  query GetRepos($login: String!, $after: String) {
    user(login: $login) {
      repositories(first: 10, after: $after) {
        edges {
          node {
            id
            name
            nameWithOwner
            description
            updatedAt
            isFork
            parent {
              nameWithOwner
            }
            stargazers {
              totalCount
            }
            forks {
              totalCount
            }
            primaryLanguage {
              color
              name
            }
            licenseInfo {
              nickname
              name
            }
          }
          cursor
        }
        pageInfo {
          hasNextPage
        }
      }
    }
  }
`;

const withRepos = graphql(GetReposQuery, {
  name: 'repos',
  skip: ({ enableRepos }) => !enableRepos,
  options: (props) => ({
    variables: {
      login: props.user
    },
    notifyOnNetworkStatusChange: true
  }),
  props: ({ repos, ownProps }) => {
    let data = repos;

    if (data.loading) {
      return { loading: true, fetchNextPage: () => {} };
    }

    if (data.error) {
      console.log(data.error);
    }

    const fetchNextPage = () => {
      return data.fetchMore({
        variables: {
          after: _.last(data.user.repositories.edges).cursor,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          return Object.assign({}, previousResult, {
            user: {
              __typename: previousResult.user.__typename,
              repositories: {
                __typename: previousResult.user.repositories.__typename,
                edges: [ ...previousResult.user.repositories.edges, ...fetchMoreResult.user.repositories.edges ],
                pageInfo: fetchMoreResult.user.repositories.pageInfo,
              }
            }
          });
        }
      });
    };

    return {
      repos: {
        repository: data.user.repositories,
        hasNextPage: data.user.repositories.pageInfo.hasNextPage,
        fetchNextPage
      }
    };
  }
});

export default connect()(withRepos(RepositoryList));