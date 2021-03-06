import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, View, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  Container, Content, Separator, ListItem, Text, Left, Body, Right, Thumbnail,
  Tab, Tabs, ScrollableTab
} from 'native-base';

import UserList from './UserList';
import RepositoryList from './RepositoryList';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8'
  }
});

/**
 * User Repo/Starred/Follower/Following screen
 * @class UserRSFFScreen
 * @desc Will hold a tab container which contains list components
 */
class UserRSFFScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  /**
   * Set header based on navigation state
   */
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.user.login} List`,
  });

  /**
   * Render function
   * @return {ReactDOM}
   */
  render() {
    let { dispatch } = this.props;
    let login = this.props.navigation.state.params.user.login;

    return (
      <Container style={styles.container}>
        <Content scrollEnabled={false}>
          <Tabs renderTabBar={()=> <ScrollableTab />}>
            <Tab heading={'Repos'}>
              <RepositoryList user={login} enableRepos />
            </Tab>
            <Tab heading={'Starred'}>
              <RepositoryList user={login} enableStarredRepos />
            </Tab>
            <Tab heading={'Followers'}>
              <UserList user={login} enableFollowers />
            </Tab>
            <Tab heading={'Following'}>
              <UserList user={login} enableFollowing />
            </Tab>
          </Tabs>
        </Content>
      </Container>
    );
  }
};

export default connect()(UserRSFFScreen);