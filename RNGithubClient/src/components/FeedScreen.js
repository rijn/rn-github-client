import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import { Container, Header, Item, Input, Icon, Button, Text } from 'native-base';
import { SearchBar } from 'react-native-elements';

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

    this.state = {
      searchText: ''
    };
  }

  render() {
    let { dispatch } = this.props;
    let { searchText } = this.state;

    return (
      <Container>
        <SearchBar
          onSubmitEditing={() => { dispatch({ type: 'Search', params: { query: searchText } }); }}
          onChangeText={(searchText) => { this.setState({ searchText })}}
          returnKeyType='search'
          placeholder='Search for any repo / user...' />
      </Container>
    );
  }
};

export default connect()(FeedScreen);