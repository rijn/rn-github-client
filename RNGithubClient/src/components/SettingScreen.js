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

const SettingScreen = () => (
  <View style={styles.container}>
    <Text>Setting</Text>
  </View>
);

export default SettingScreen;