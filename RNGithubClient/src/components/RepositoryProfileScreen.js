import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, View, WebView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  Container, Content, Separator, ListItem, Text, Left, Body, Right, Thumbnail,
  Tab, Tabs, ScrollableTab, Icon
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
  inline: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  inlineInnerCeil: {
    marginRight: 10
  },
  ceil: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 100,
    borderColor: '#c9c9c9'
  },
  ceilBottom: {
    borderBottomWidth: 0.5
  },
  ceilLeft: {
    borderRightWidth: 0.5
  }
});

const iconSize = 20;

/**
 * Attributes and Icon map
 */
const attrMap = {
  createdAt: {
    displayName: 'Created',
    icon: 'ios-calendar-outline',
    processor: v => new Date(v).toLocaleDateString()
  },
  owner: {
    displayName: 'Owner',
    icon: 'ios-contact-outline',
    processor: ({ login }) => login,
    clickable: true,
    onPress: ({ login }, dispatch) => { dispatch({ type: 'UserProfile', params: { user: { login } } }); }
  }
};

/**
 * Repository profile screen
 * @class RepositoryProfileScreen
 */
class RepositoryProfileScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  /**
   * Set the header based on navigation state
   */
  static navigationOptions = ({ navigation: { state: { params: { repository: { name, owner } } } } }) => ({
    title: `${owner}/${name}`,
  });

  /**
   * Primay language component
   * @param  {Object} primaryLanguage
   * @return {ReactDOM}
   */
  primaryLanguageView(primaryLanguage) {
    if (!primaryLanguage) return;
    let { name: primaryLanguageName, color: primaryLanguageColor } = primaryLanguage;
    return (
      <View style={[ styles.inline, styles.inlineInnerCeil ]}>
        <View style={{
          width: 7, height: 7, borderRadius: 7,
          marginRight: 5,
          backgroundColor: primaryLanguageColor
        }}></View>
        <Text note>{primaryLanguageName}</Text>
      </View>
    );
  }

  /**
   * Render function
   * @return {ReactDOM}
   */
  render() {
    let { repositoryProfile: { error, loading } } = this.props;

    if (error) {
      return <Text>{error.toString()}</Text>;
    } else if (loading) {
      return <Text>Loading</Text>;
    } else {

      let { repositoryProfile: { repository }, dispatch } = this.props;

      let Attrs = _.chain(repository).pick(_.keys(attrMap)).map((value, key) => {
        if (!value) return;
        return (
          <ListItem icon
            last={key === _.last(_.keys(attrMap))}
            key={key}
            onPress={attrMap[key].clickable &&
              (() => {
                return () => {
                  attrMap[key].onPress(value, dispatch);
                }
              })(value, dispatch)
            }
            >
            <Left>
              <Ionicons name={attrMap[key].icon} size={iconSize} style={styles.icon} />
            </Left>
            <Body>
              <Text>{attrMap[key].displayName}</Text>
            </Body>
            <Right>
              <Text>{attrMap[key].processor ? attrMap[key].processor(value) : _.identity(value)}</Text>
              {attrMap[key].clickable && <Icon name='arrow-forward' />}
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
              <ListItem>
                <Grid>
                  <Row>
                    <Text>{repository.nameWithOwner}</Text>
                  </Row>
                  <Row>
                    <Text note style={styles.list}>{repository.description}</Text>
                  </Row>
                  <View style={[ styles.inline, { marginTop: 5 } ]}>
                    {this.primaryLanguageView(repository.primaryLanguage)}
                    <View style={[ styles.inline, styles.inlineInnerCeil ]}>
                      <Ionicons name='ios-star-outline' style={{ marginRight: 5 }} />
                      <Text note>{repository.stargazers.totalCount}</Text>
                    </View>
                    <View style={[ styles.inline, styles.inlineInnerCeil ]}>
                      <Ionicons name='ios-git-network-outline' style={{ marginRight: 5 }} />
                      <Text note>{repository.forks.totalCount}</Text>
                    </View>
                    <Text note>Updated at {new Date(repository.updatedAt).toLocaleDateString()}</Text>
                  </View>
                </Grid>
              </ListItem>
              {Attrs}
              <Separator bordered>
              </Separator>
              <ListItem last onPress={() => { dispatch({ type: 'WebView', params: { url: repository.url } }); }}>
                <Body>
                  <Text>View webpage</Text>
                </Body>
                <Right>
                  <Ionicons name='ios-arrow-forward' />
                </Right>
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
 * Required repository profile information
 */
RepositoryProfileScreen.propTypes = {
  repositoryProfile: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    repository: PropTypes.object,
  }).isRequired
};

/**
 * Get repository profile query
 */
const GetRepositoryProfileQuery = gql`
  query getRepositoryProfile($name: String!, $owner: String!) {
    repository(name: $name, owner: $owner) {
      id
      name
      updatedAt
      createdAt
      description
      nameWithOwner
      url
      owner {
        id
        login
        avatarUrl
      }
      primaryLanguage {
        name
        color
      }
      stargazers {
        totalCount
      }
      forks {
        totalCount
      }
      watchers {
        totalCount
      }
      issues {
        totalCount
      }
      pullRequests {
        totalCount
      }
      isFork
      parent {
        nameWithOwner
      }
      licenseInfo {
        name
        nickname
      }
    }
  }
`;

/**
 * Apollo Container
 */
const withInfo = graphql(GetRepositoryProfileQuery, {
  name: 'repositoryProfile',
  options: (props) => ({
    pollInterval: 20000,
    variables: props.navigation.state.params.repository
  })
});

export default connect()(withInfo(RepositoryProfileScreen));