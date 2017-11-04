import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, View, FlatList } from 'react-native';
import { Container, Content, Separator, List, ListItem, Text, Left, Body, Right, Thumbnail } from 'native-base';
import ErrorToast from './ErrorToast';

import { getNotification } from '../services/githubNotification';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});

class SettingScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notifications: [],
      loading: false,
      refreshing: true
    };
  }

  componentWillReceiveProps ({ currentRoute }) {
    if (!currentRoute) return;
    if (currentRoute.key == 'Notification' && this.state.notifications.length == 0) {
      this.handleRequest()
    }
  }

  handleRequest = (before) => {
    this.setState({ loading: true });
    console.log(before);
    return getNotification(before).then(res => {
      this.setState({
        notifications: _.uniqBy(_.concat(this.state.notifications, res), 'id')
      });
      this.setState({ loading: false, refreshing: false });
    }).catch(e => {
      ErrorToast(e);
      this.setState({ loading: false, refreshing: false });
    });
  }

  handleRefresh = () => {
    this.setState({
      refreshing: true,
      notifications: []
    }, () => { this.handleRequest(); });
  }

  handleLoadMore = ({ distanceFromEnd }) => {
    if (this.state.loading) return;
    console.log(this.state.notifications.length);
    this.handleRequest(_.last(this.state.notifications).updated_at);
  }

  convertDate = (date) => {
    if (!_.isDate(date)) date = new Date(date);
    var seconds = Math.floor((new Date() - date) / 1000);
    var interval = Math.floor(seconds / 31536000);
    if (interval > 1) {
      return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }

  render() {
    let { dispatch } = this.props;
    let { notifications, loading } = this.state;

    return (
      <Container>
        <Content>
          <View style={styles.container}>
            <List scrollEnabled={false} style={styles.container}>
              <FlatList
                data={notifications}
                refreshing={this.state.refreshing}
                onEndReached={this.handleLoadMore}
                onEndReachedThreshold={0}
                onRefresh={this.handleRefresh}
                keyExtractor={({ id }) => id}
                renderItem={({ item: { id, repository: { full_name }, subject: { title, url }, updated_at } }) => (
                  <ListItem avatar onPress={() => { dispatch({ type: 'WebView', params: { url: url.replace('api.github.com/repos', 'github.com') } }); }}>
                    <Left>
                    </Left>
                    <Body>
                      <Text note>{full_name}</Text>
                      <Text>{title}</Text>
                    </Body>
                    <Right>
                      <Text note>{this.convertDate(updated_at)}</Text>
                    </Right>
                  </ListItem>
                )}
              />
            </List>
          </View>
        </Content>
      </Container>
    );
  }
};

const mapStateToProps = ({ nav }) => {
  if (!nav.routes[nav.index].routes) return;
  const currentRouteIndex = nav.routes[nav.index].index;
  const currentRoute = nav.routes[nav.index].routes[currentRouteIndex];

  return { currentRoute }
}

export default connect(mapStateToProps)(SettingScreen);