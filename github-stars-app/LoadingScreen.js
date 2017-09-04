import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';

export default class LoadingScreen extends React.Component {
  render() {
    return (
      <View style={styles.indicator}>
        <ActivityIndicator />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  indicator: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
