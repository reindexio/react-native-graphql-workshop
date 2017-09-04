import React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';

export default class Repository extends React.Component {
  renderStarToggle() {
    return <Button title="Star" />;
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>fake/fake-repository</Text>
        {this.renderStarToggle()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderColor: 'lightgray',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 15,
  },
  button: {
    height: 35,
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
