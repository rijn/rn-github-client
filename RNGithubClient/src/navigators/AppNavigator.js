import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, TabNavigator, StackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Root } from "native-base";

import FeedScreen from '../components/FeedScreen';
import MeScreen from '../components/MeScreen';
import SettingScreen from '../components/SettingScreen';

import LoginScreen from '../components/LoginScreen';
import UserProfileScreen from '../components/UserProfileScreen';
import UserRSFFScreen from '../components/UserRSFFScreen';
import RepositoryProfileScreen from '../components/RepositoryProfileScreen';
import WebView from '../components/WebView';

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
  Me: {
    screen: MeScreen,
    navigationOptions: {
      title: 'Me',
      tabBarLabel: 'Me',
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-person' : 'ios-person-outline'}
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
  WebView: { screen: WebView }
}, {
  'header': null
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