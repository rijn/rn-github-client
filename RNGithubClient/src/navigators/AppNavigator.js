import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, TabNavigator, StackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Root } from "native-base";

import FeedScreen from '../components/FeedScreen';
import NotificationScreen from '../components/NotificationScreen';
import SettingScreen from '../components/SettingScreen';

import LoginScreen from '../components/LoginScreen';
import UserProfileScreen from '../components/UserProfileScreen';
import UserRSFFScreen from '../components/UserRSFFScreen';
import RepositoryProfileScreen from '../components/RepositoryProfileScreen';
import WebView from '../components/WebView';
import SearchScreen from '../components/SearchScreen';

const iconSize = 26;

/**
 * Bottom tab navigator
 */
export const TabNav = TabNavigator({
  Feed: {
    screen: FeedScreen,
    navigationOptions: {
      title: 'Feed',
      tabBarLabel: 'Feed',
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-compass' : 'ios-compass-outline'}
          size={iconSize}
          style={{ color: tintColor }}
        />
      ),
    }
  },
  Notification: {
    screen: NotificationScreen,
    navigationOptions: {
      title: 'Notification',
      tabBarLabel: 'Notification',
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-notifications' : 'ios-notifications-outline'}
          size={iconSize}
          style={{ color: tintColor }}
        />
      ),
    }
  },
  Setting: {
    screen: SettingScreen,
    navigationOptions: {
      title: 'Setting',
      tabBarLabel: 'Setting',
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-settings' : 'ios-settings-outline'}
          size={iconSize}
          style={{ color: tintColor }}
        />
      ),
    }
  }
}, {
  tabBarPosition: 'bottom',
  animationEnabled: false,
  swipeEnabled: false,
  tabBarOptions: {
    activeTintColor: '#00a6de',
  },
  navigationOptions: {
    headerTintColor: '#fff',
    headerStyle: { backgroundColor: '#24292e' },
  }
});

/**
 * Stack navigator based on Tab navigator
 */
export const AppNavigator = StackNavigator({
  Root: {
    screen: TabNav,
  },
  Login: { screen: LoginScreen, navigationOptions: { header: null } },
  UserProfile: { screen: UserProfileScreen },
  RepositoryProfile: { screen: RepositoryProfileScreen },
  UserRSFF: { screen: UserRSFFScreen },
  WebView: { screen: WebView },
  Search: { screen: SearchScreen }
}, {
  'header': null,
  navigationOptions: {
    headerTintColor: '#fff',
    headerStyle: { backgroundColor: '#24292e' },
  }
});

/**
 * Container with navigation
 */
const AppWithNavigationState = ({ dispatch, nav }) => (
  <Root>
    <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
  </Root>
);

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);