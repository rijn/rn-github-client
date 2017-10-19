import React from 'react';
import { Button, StyleSheet, View, Text } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

const MeScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Text>Me</Text>
    <Button
      onPress={() => navigation.dispatch({ type: 'UserProfile', params: { id: 'me' } })}
      title="Test"
    />
  </View>
);

export default MeScreen;