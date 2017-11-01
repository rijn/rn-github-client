import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, View, FlatList, Dimensions, Button } from 'react-native';
import {
  Container, Content, Separator, List, ListItem, Text, Left, Body, Right,
  Thumbnail, Spinner, Toast
} from 'native-base';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import {
  starRepo,
  unstarRepo
} from '../services/githubStar';

import ErrorToast from './ErrorToast';

const styles = StyleSheet.create({
});

export class StarButton extends React.Component {
  constructor(props) {
    super(props);
  }

  async changeStarRepo(viewerHasStarred) {
    try {
      const res = viewerHasStarred ? await unstarRepo(this.props) : await starRepo(this.props);
      this.props.data.refetch();
    } catch (e) {
      ErrorToast(e);
    }
  }

  render() {
    let { dispatch, data } = this.props;

    if (!data || data.loading) {
      return <Spinner color='#00a6de' />;
    }

    let { repository: { viewerHasStarred } } = data;

    return (
      <Ionicons
        name={viewerHasStarred ? 'ios-star' : 'ios-star-outline'}
        size={20} color='#00a6de'
        onPress={() => { this.changeStarRepo(viewerHasStarred); }} />
    );
  }
};

StarButton.propTypes = {
  owner: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

const GetStarStatusQuery = gql`
  query GetFollowStatus($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      viewerHasStarred
    }
  }
`;

const withInfo = graphql(GetStarStatusQuery, {
  options: (props) => ({
    variables: props
  })
});

export default connect()(withInfo(StarButton));