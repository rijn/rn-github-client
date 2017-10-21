import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import { Container, Content, Separator, ListItem, Text, Left, Body, Right, Thumbnail } from 'native-base';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
  }
});

class SettingScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Container>
        <Content>
          <View style={styles.container}>
            <Separator bordered>
              <Text>Account</Text>
            </Separator>
            <ListItem last>
              <Text style={{ color: '#f00' }}>Log out</Text>
            </ListItem>
          </View>
        </Content>
      </Container>
    );
  }
};

export default connect()(SettingScreen);