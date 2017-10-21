import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, View, WebView as _WebView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  Container, Content, Separator, ListItem, Text, Left, Body, Right, Thumbnail,
  Tab, Tabs, ScrollableTab, Icon
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid'

import UserList from './UserList';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';


class WebView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <_WebView
        source={{ uri: this.props.navigation.state.params.url }}
        style={{ flex: 1 }}
      />
    );
  }
};

export default connect()(WebView);