import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

const UserProfileScreen = ({ navigation }) => {
  let params = navigation.state.params;

  return <View style={styles.container}>
    <Text>UserProfile</Text>
    <Text>{params.id}</Text>
  </View>;
};

export default UserProfileScreen;