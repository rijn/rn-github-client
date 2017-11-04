import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  Container, Content, Separator, ListItem, Text, Left, Body, Right, Thumbnail,
  Tab, Tabs, ScrollableTab, Spinner
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import UserList from './UserList';
import RepositoryList from './RepositoryList';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
  },
  icon: {
    width: 20
  },
  list: {
    marginTop: 5
  }
});

export class SearchScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  /**
   * Set header based on navigation state
   */
  // static navigationOptions = ({ navigation }) => ({
  //   title: navigation.state.params.query,
  // });

  /**
   * Render function
   * @return {ReactDOM}
   */
  render() {
    console.log(this.props);
    let { search: { error, loading } } = this.props;

    if (error) {
      return <Text>{error.toString()}</Text>;
    } else if (loading) {
      return <Spinner color='#00a6de' />;
    } else {
      let { search: { repositorySearch: { repositoryCount }, userSearch: { userCount } } } = this.props;
      console.log(this.props)
      return (
        <Container>
          <Content>
            <Tabs initialPage={0}>
              <Tab heading={`Repository(${repositoryCount})`}>
                <RepositoryList enableSearchRepos query={this.props.navigation.state.params.query} />
              </Tab>
              <Tab heading={`User(${userCount})`}>
                <UserList enableSearchUsers query={this.props.navigation.state.params.query} />
              </Tab>
            </Tabs>
          </Content>
        </Container>
      );
    }
  }
};

const SearchQuery = gql`
  query Search($query: String!) {
    repositorySearch: search(query: $query, first: 5, type: REPOSITORY) {
      repositoryCount
    }
    userSearch: search(query: $query, first: 5, type: USER) {
      userCount
    }
  }
`;

/**
 * Apollo container
 */
const withInfo = graphql(SearchQuery, {
  name: 'search',
  options: (props) => ({
    variables: props.navigation.state.params
  })
});

export default connect()(withInfo(SearchScreen));