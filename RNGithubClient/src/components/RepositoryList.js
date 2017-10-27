import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StyleSheet, View, FlatList, Dimensions } from 'react-native';
import {
  Container, Content, Separator, List, ListItem, Text, Left, Body, Right,
  Thumbnail, Button, Spinner
} from 'native-base';

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

/**
 * List of repositories screen
 *
 * @class RepositoryList
 */
class RepositoryList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      composed: null,
      refreshing: true,
      edges: []
    };
  }

  /**
   * Receive new props and calculate and concat the list
   *
   * @param  {Props} newProps
   */
  componentWillReceiveProps(newProps) {
    // this.setState({ refreshing: !!newProps.loading });
    // if (newProps.loading) return;

    let composed = newProps.repos ? newProps.repos : newProps.starredRepos ? newProps.starredRepos : null;
    let edges = _.get(composed, 'repository.edges');
    if (edges) {
      this.setState({ composed, edges });
    }
    if (this.state.refreshing == true && !!composed) {
      this.setState({ refreshing: false });
    }

    this.props = newProps;
  }

  /**
   * Primary language of repo component
   *
   * @param  {Object} primaryLanguage
   * @return {ReactDOM}
   */
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

  handleRefresh() {
    this.setState({ edges: [], refreshing: true });
    this.state.composed.refetch();
  }

  /**
   * Render function
   *
   * @return {ReactDOM}
   */
  render() {
    let { dispatch } = this.props;

    let { composed, edges, loading, refreshing } = this.state;

    let repositoryList = _.chain(edges).map(({ node }) => node).value();

    return (
      <List scrollEnabled={false} style={styles.container}>
        <FlatList
          data={repositoryList}
          onEndReached={() => { if (!this.props.loading) { return composed.fetchNextPage(); } }}
          keyExtractor={({ id }) => id}
          refreshing={refreshing}
          onRefresh={() => { this.handleRefresh(); }}
          renderItem={({
            item: {
              id, name, description, isFork,
              parent,
              primaryLanguage,
              updatedAt,
              owner: { login: owner },
              stargazers: { totalCount: stars },
              forks: { totalCount: forks }
            }
          }) => (
            <ListItem onPress={() => dispatch({ type: 'RepositoryProfile', params: { repository: { name, owner } } })}>
              <View>
                <View style={styles.inline}>
                  <Text>{name}</Text>
                  {isFork && <Text note>{parent.nameWithOwner}</Text>}
                </View>
                {description && <View style={[ styles.inline, { marginTop: 5 } ]}>
                  <Text note>{description}</Text>
                </View>}
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

/**
 * Prop Types
 * Required user and switches to control the data source
 */
RepositoryList.propTypes = {
  user: PropTypes.string.isRequired,
  enableRepos: PropTypes.bool,
  enableStarredRepos: PropTypes.bool
};

/**
 * Get Repo List Query
 */
const GetReposQuery = gql`
  query GetRepos($login: String!, $after: String) {
    user(login: $login) {
      repositories(first: 20, after: $after) {
        edges {
          node {
            id
            name
            nameWithOwner
            description
            updatedAt
            isFork
            owner {
              login
            }
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

/**
 * Get starred repo query
 */
const GetStarredReposQuery = gql`
  query GetStarredRepos($login: String!, $after: String) {
    user(login: $login) {
      starredRepositories(first: 10, after: $after) {
        edges {
          node {
            id
            name
            nameWithOwner
            description
            updatedAt
            isFork
            owner {
              login
            }
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

/**
 * Apollo Container
 *
 * Will fetch data from server, and return a function which can fetch the next page of data and can
 * be called by the component.
 */
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

    if (data.error || !data.user) {
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
        fetchNextPage,
        refetch: data.refetch
      }
    };
  }
});

/**
 * Apollo container
 * Same as previous container
 */
const withStarredRepos = graphql(GetStarredReposQuery, {
  name: 'starredRepos',
  skip: ({ enableStarredRepos }) => !enableStarredRepos,
  options: (props) => ({
    variables: {
      login: props.user
    },
    notifyOnNetworkStatusChange: true
  }),
  props: ({ starredRepos, ownProps }) => {
    let data = starredRepos;

    if (data.loading || !data.user) {
      return { loading: true, fetchNextPage: () => {} };
    }

    if (data.error) {
      console.log(data.error);
    }

    const fetchNextPage = () => {
      return data.fetchMore({
        variables: {
          after: _.last(data.user.starredRepositories.edges).cursor,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          return Object.assign({}, previousResult, {
            user: {
              __typename: previousResult.user.__typename,
              starredRepositories: {
                __typename: previousResult.user.starredRepositories.__typename,
                edges: [ ...previousResult.user.starredRepositories.edges, ...fetchMoreResult.user.starredRepositories.edges ],
                pageInfo: fetchMoreResult.user.starredRepositories.pageInfo,
              }
            }
          });
        }
      });
    };

    return {
      repos: {
        repository: data.user.starredRepositories,
        hasNextPage: data.user.starredRepositories.pageInfo.hasNextPage,
        fetchNextPage,
        refetch: data.refetch
      }
    };
  }
});

export default connect()(withStarredRepos(withRepos(RepositoryList)));