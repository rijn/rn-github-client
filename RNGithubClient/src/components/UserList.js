import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, View, FlatList, Dimensions } from 'react-native';
import {
  Container, Content, Separator, List, ListItem, Text, Left, Body, Right,
  Thumbnail, Button, Spinner
} from 'native-base';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
  }
});

/**
 * User List Component
 * @class UserList
 */
class UserList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      composed: null
    };
  }

  /**
   * Receive new props and calculate and concat list
   * @param  {Prop} newProps
   */
  componentWillReceiveProps(newProps) {
    if (newProps.loading) return;

    let composed = newProps.followers && this.props.following ? {
      user: {
        edges: [ ...newProps.followers.user.edges, ...newProps.following.user.edges ]
      },
      hasNextPage: newProps.followers.hasNextPage || newProps.following.hasNextPage,
      fetchNextPage: _.flow([ newProps.followers.fetchNextPage, newProps.following.fetchNextPage ])
    } : newProps.followers ? newProps.followers : newProps.following ? newProps.following : null;

    this.setState({ composed });

    this.props = newProps;
  }

  /**
   * Render function
   * @return {ReactDOM}
   */
  render() {
    let { dispatch } = this.props;

    let composed = this.state.composed;

    if (!composed) {
      return <Spinner color='#00a6de' />;
    }

    let userList = _.chain(composed.user.edges).map(({ node }) => node).value();

    return (
      <List scrollEnabled={false} style={styles.container}>
        <FlatList
          data={userList}
          onEndReached={() => { if (!this.props.loading) { return composed.fetchNextPage(); } }}
          keyExtractor={({ id }) => id}
          renderItem={({ item: { id, login, name, avatarUrl, bio } }) => (
            <ListItem avatar onPress={() => dispatch({ type: 'UserProfile', params: { user: { login } } })}>
              <Left>
                <Thumbnail small source={{ uri: avatarUrl }} />
              </Left>
              <Body>
                <Text>{name}</Text>
                <Text note>{bio}</Text>
              </Body>
              <Right>
                <Text note>{login}</Text>
              </Right>
            </ListItem>
          )}
        />
      </List>
    );
  }
};

/**
 * Prop Type
 * Required user and bool to indicate the data source
 */
UserList.propTypes = {
  user: PropTypes.string.isRequired,
  enableFollowers: PropTypes.bool,
  enableFollowing: PropTypes.bool
};

/**
 * Get followers query
 */
const GetFollowersQuery = gql`
  query GetFollowers($login: String!, $after: String) {
    user(login: $login) {
      followers(first: 10, after: $after) {
        edges {
          node {
            id
            login
            name
            bio
            avatarUrl
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
 * Get following query
 */
const GetFollowingQuery = gql`
  query GetFollowing($login: String!, $after: String) {
    user(login: $login) {
      following(first: 10, after: $after) {
        edges {
          node {
            id
            login
            name
            bio
            avatarUrl
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
 * Apollo container
 * Will fetch data from data source and return a function which can pull the next page data that
 * can be used in the component.
 */
const withFollowers = graphql(GetFollowersQuery, {
  name: 'followers',
  skip: ({ enableFollowers }) => !enableFollowers,
  options: (props) => ({
    variables: {
      login: props.user
    },
    notifyOnNetworkStatusChange: true
  }),
  props: ({ followers, ownProps }) => {
    let data = followers;

    if (data.loading) {
      return { loading: true, fetchNextPage: () => {} };
    }

    if (data.error) {
      console.log(data.error);
    }

    const fetchNextPage = () => {
      return data.fetchMore({
        variables: {
          after: _.last(data.user.followers.edges).cursor,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          return Object.assign({}, previousResult, {
            user: {
              __typename: previousResult.user.__typename,
              followers: {
                __typename: previousResult.user.followers.__typename,
                edges: [ ...previousResult.user.followers.edges, ...fetchMoreResult.user.followers.edges ],
                pageInfo: fetchMoreResult.user.followers.pageInfo,
              }
            }
          });
        }
      });
    };

    return {
      followers: {
        user: data.user.followers,
        hasNextPage: data.user.followers.pageInfo.hasNextPage,
        fetchNextPage
      }
    };
  }
});

/**
 * Apollo container
 * Same as the previous one
 */
const withFollowing = graphql(GetFollowingQuery, {
  name: 'following',
  skip: ({ enableFollowing }) => !enableFollowing,
  options: (props) => ({
    variables: {
      login: props.user
    },
    notifyOnNetworkStatusChange: true
  }),
  props: ({ following, ownProps }) => {
    let data = following;

    if (data.loading) {
      return { loading: true, fetchNextPage: () => {} };
    }

    if (data.error) {
      console.log(data.error);
    }

    const fetchNextPage = () => {
      return data.fetchMore({
        variables: {
          after: _.last(data.user.following.edges).cursor,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          return Object.assign({}, previousResult, {
            user: {
              __typename: previousResult.user.__typename,
              following: {
                __typename: previousResult.user.following.__typename,
                edges: [ ...previousResult.user.following.edges, ...fetchMoreResult.user.following.edges ],
                pageInfo: fetchMoreResult.user.following.pageInfo,
              }
            }
          });
        }
      });
    };

    return {
      following: {
        user: data.user.following,
        hasNextPage: data.user.following.pageInfo.hasNextPage,
        fetchNextPage
      }
    };
  }
});

export default connect()(withFollowing(withFollowers(UserList)));