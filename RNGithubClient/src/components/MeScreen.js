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
 * @class MeScreen
 * @desc  My profile and my private repos
 */
class MeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  /**
   * Render function
   *
   * @return {ReactDOM}
   */
  render() {
    if (!this.props.userInfo) return (<View></View>);

    let { userInfo: { error, loading }, dispatch } = this.props;

    if (error) {
      return <Text>{error.toString()}</Text>;
    } else if (loading) {
      return <Text>Loading</Text>;
    } else {
      let { userInfo: { user: { login, avatarUrl, name, bio, company } } } = this.props;

      return (
        <Container>
          <Content>
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
          </Content>
        </Container>
      );
    }
  }
};

/**
 * Prop Types
 *
 * desc       To render MeScreen properly, we need the uui
 */
MeScreen.propTypes = {
  userInfo: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    user: PropTypes.object,
  }).isRequired
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
      login: props.user
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

export default connect(mapStateToProps)(withInfo(MeScreen));