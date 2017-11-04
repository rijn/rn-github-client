import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { Container, Content, Separator, ListItem, Text, Left, Body, Right, Thumbnail } from 'native-base';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
  }
});

/**
 * Class for me screen.
 *
 * @class SettingScreen
 * @desc  My profile and my private repos
 */
export class SettingScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  Me = () => {
    if (!this.props.userInfo) return (<View></View>);

    let { userInfo: { error, loading }, dispatch } = this.props;

    if (error) {
      return <Text>{error.toString()}</Text>;
    } else if (loading) {
      return <Text>Loading</Text>;
    } else {
      let { userInfo: { user: { login, avatarUrl, name, bio, company } } } = this.props;

      return (
        <View style={styles.container}>
          <Separator bordered>
            <Text>Profile</Text>
          </Separator>
          <ListItem avatar>
            <Left>
              <Thumbnail source={{ uri: avatarUrl }} />
            </Left>
            <Body>
              <Text>{name}</Text>
              <Text note>{bio}</Text>
              <Text note>{company}</Text>
            </Body>
            <Right>
            </Right>
          </ListItem>
          <ListItem last onPress={() => dispatch({ type: 'UserProfile', params: { user: { login } } })}>
            <Text>View profile</Text>
          </ListItem>
        </View>
      );
    }
  }

  Setting = () => {
    let { dispatch } = this.props;
    return (
      <View style={styles.container}>
        <Separator bordered>
          <Text>Account</Text>
        </Separator>
        <ListItem last onPress={() => { dispatch({ type: 'Logout' }); }}>
          <Text style={{ color: '#f00' }}>Log out</Text>
        </ListItem>
      </View>
    );
  }

  render() {
    return (
      <Container>
        <Content>
          <View style={styles.container}>
            {this.Me()}
            {this.Setting()}
          </View>
        </Content>
      </Container>
    );
  }
};

/**
 * Prop Types
 *
 * desc       To render SettingScreen properly, we need the uui
 */
SettingScreen.propTypes = {
  userInfo: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    user: PropTypes.object,
  })
};

/**
 * Query for getting user info
 */
const GetUserInfoQuery = gql`
  query getUserInfo($login: String!) {
    user(login: $login) {
      login
      name
      avatarUrl
      bio
      company
      email
    }
  }
`;

/**
 * Apollo container
 */
const withInfo = graphql(GetUserInfoQuery, {
  name: 'userInfo',
  skip: (ownProps) => !ownProps.isLoggedIn,
  options: (props) => ({
    pollInterval: 20000,
    variables: {
      login: props.user.login
    }
  })
});

/**
 * State Props mapper
 */
const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
  user: state.auth.user,
});

export default connect(mapStateToProps)(withInfo(SettingScreen));