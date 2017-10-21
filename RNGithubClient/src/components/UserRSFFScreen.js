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

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: height - 64
  }
});

class UserRSFFScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.user.login} List`,
  });

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