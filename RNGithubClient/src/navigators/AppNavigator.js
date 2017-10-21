import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, TabNavigator, StackNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import FeedScreen from '../components/FeedScreen';
import MeScreen from '../components/MeScreen';
import SettingScreen from '../components/SettingScreen';

import LoginScreen from '../components/LoginScreen';
import UserProfileScreen from '../components/UserProfileScreen';
import UserRSFFScreen from '../components/UserRSFFScreen';

const iconSize = 26;

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

export const AppNavigator = StackNavigator({
  Root: {
    screen: TabNav,
  },
  Login: { screen: LoginScreen, navigationOptions: { header: null } },
  UserProfile: { screen: UserProfileScreen },
  UserRSFF: { screen: UserRSFFScreen }
}, {
  'header': null
});

const AppWithNavigationState = ({ dispatch, nav }) => (
  <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
);

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);