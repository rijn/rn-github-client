import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  Container, Content, Separator, ListItem, Text, Left, Body, Right, Thumbnail,
  Tab, Tabs, ScrollableTab
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid'

import UserList from './UserList';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
  },
  icon: {
    width: 20
  },
  list: {
    marginTop: 5
  },
  ceil: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 100,
    borderBottomWidth: 0.5,
    borderColor: '#c9c9c9'
  },
  ceilLeft: {
    borderRightWidth: 0.5
  }
});

const iconSize = 20;

const attrMap = {
  company: {
    displayName: 'Company',
    icon: 'ios-people-outline'
  },
  location: {
    displayName: 'Location',
    icon: 'ios-pin-outline'
  },
  email: {
    displayName: 'Email',
    icon: 'ios-mail-outline'
  },
  websiteUrl: {
    displayName: 'Website',
    icon: 'ios-link-outline'
  },
  createdAt: {
    displayName: 'Created',
    icon: 'ios-calendar-outline',
    processor: v => new Date(v).toLocaleDateString()
  }
};

class UserProfileScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.user.login,
  });

  render() {
    let { userProfile: { error, loading } } = this.props;

    if (error) {
      return <Text>{error.toString()}</Text>;
    } else if (loading) {
      return <Text>Loading</Text>;
    } else {
      let { userProfile: { user }, dispatch } = this.props;

      let Attrs = _.chain(user).pick(_.keys(attrMap)).map((value, key) => {
        if (!value) return;
        return (
          <ListItem icon last={key === _.last(_.keys(attrMap))} key={key}>
            <Left>
              <Ionicons name={attrMap[key].icon} size={iconSize} style={styles.icon} />
            </Left>
            <Body>
              <Text>{attrMap[key].displayName}</Text>
            </Body>
            <Right>
              <Text>{attrMap[key].processor ? attrMap[key].processor(value) : _.identity(value)}</Text>
            </Right>
          </ListItem>
        );
      }).value();

      return (
        <Container>
          <Content>
            <View style={styles.container}>
              <Separator bordered>
                <Text>Profile</Text>
              </Separator>
              <ListItem avatar>
                <Left>
                  <Thumbnail source={{ uri: user.avatarUrl }} />
                </Left>
                <Body>
                  <Text>{user.name}</Text>
                  <Text note style={styles.list}>{user.login}</Text>
                  <Text note style={styles.list}>{user.bio}</Text>
                </Body>
                <Right>
                </Right>
              </ListItem>
              {Attrs}
            </View>
            <View>
              <Separator bordered>
                <Text>Statistic</Text>
              </Separator>
              <Grid onPress={() => dispatch({ type: 'UserRSFF', params: { user } })}>
                <Row>
                  <Col style={[ styles.ceil, styles.ceilLeft ]}>
                    <Text note>Repos</Text>
                    <Text>{user.repositories.totalCount}</Text>
                  </Col>
                  <Col style={styles.ceil}>
                    <Text note>Starred</Text>
                    <Text>{user.starredRepositories.totalCount}</Text>
                  </Col>
                </Row>
                <Row>
                  <Col style={[ styles.ceil, styles.ceilLeft ]}>
                    <Text note>Followers</Text>
                    <Text>{user.followers.totalCount}</Text>
                  </Col>
                  <Col style={styles.ceil}>
                    <Text note>Following</Text>
                    <Text>{user.following.totalCount}</Text>
                  </Col>
                </Row>
              </Grid>
            </View>
          </Content>
        </Container>
      );
    }
  }
};

UserProfileScreen.propTypes = {
  userProfile: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    user: PropTypes.object,
  }).isRequired
};

const GetUserProfileQuery = gql`
  query getUserProfile($login: String!) {
    user(login: $login) {
      login
      name
      avatarUrl
      bio
      location
      company
      websiteUrl
      email
      createdAt
      followers {
        totalCount
      }
      following {
        totalCount
      }
      repositories {
        totalCount
      }
      starredRepositories {
        totalCount
      }
    }
  }
`;

const withInfo = graphql(GetUserProfileQuery, {
  name: 'userProfile',
  options: (props) => ({
    pollInterval: 20000,
    variables: props.navigation.state.params.user
  })
});

UserProfileScreen = withInfo(UserProfileScreen);

export default connect()(UserProfileScreen);