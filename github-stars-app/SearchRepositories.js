import React from 'react';
import { View, TextInput, StyleSheet, Button } from 'react-native';
import ListOfRepositories from './ListOfRepositories';

export default class SearchRepositories extends React.Component {
  static navigationOptions = {
    title: 'Search for repositories',
  };

  state = {
    searchText: '',
    activeSearch: null,
  };

  handleChange = text => {
    this.setState({
      searchText: text,
    });
  };

  renderResult() {
    if (this.state.activeSearch) {
      return <ListOfRepositories />;
    }
  }

  render() {
    return (
      <View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={this.state.searchText}
            onChangeText={this.handleChange}
          />
          <Button title="Search" />
        </View>
        {this.renderResult()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    paddingTop: 15,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },
  input: {
    fontSize: 15,
    height: 20,
  },
});
