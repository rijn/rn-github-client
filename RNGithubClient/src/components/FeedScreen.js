import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'native-base';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

/**
 * Class for feed screen.
 *
 * @desc All user activities
 *
 * @class FeedScreen
 */
class FeedScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    let { dispatch } = this.props;

    return (
      <View style={styles.container}>
        <Text>Main</Text>
      </View>
    );
  }
};

export default connect()(FeedScreen);