import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, View, FlatList, Dimensions } from 'react-native';
import {
  Container, Content, Separator, List, ListItem, Text, Left, Body, Right,
  Thumbnail, Button, Spinner, Toast
} from 'native-base';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import {
  followUser as callFollowUser,
  unfollowUser as callUnfollowUser
} from '../services/githubFollow';

import ErrorToast from './ErrorToast';

const styles = StyleSheet.create({
});

class FollowButton extends React.Component {
  constructor(props) {
    super(props);
  }

  async followUser() {
    let { login } = this.props;
    try {
      const res = await callFollowUser(login);
      this.props.data.refetch();
    } catch (e) {
      ErrorToast(e);
    }
  }

  async unfollowUser() {
    let { login } = this.props;
    try {
      const res = await callUnfollowUser(login);
      this.props.data.refetch();
    } catch (e) {
      ErrorToast(e);
    }
  }

  render() {
    let { dispatch, data } = this.props;

    console.log(this.props);

    if (!data || data.loading) {
      return <Spinner color='#00a6de' />;
    }

    let { user: { viewerCanFollow, viewerIsFollowing } } = data;

    if (!viewerCanFollow) {
      return <View></View>
    }

    return (
      <Button small info bordered={viewerIsFollowing}
        onPress={() => { viewerIsFollowing ? this.unfollowUser() : this.followUser(); }}>
        <Text>{viewerIsFollowing ? 'Followed' : 'Follow'}</Text>
      </Button>
    );
  }
};

FollowButton.propTypes = {
  login: PropTypes.string.isRequired
};

const GetFollowStatusQuery = gql`
  query GetFollowStatus($login: String!) {
    user(login: $login) {
      viewerCanFollow
      viewerIsFollowing
    }
  }
`;

const withInfo = graphql(GetFollowStatusQuery, {
  options: (props) => ({
    variables: props
  })
});

export default connect()(withInfo(FollowButton));