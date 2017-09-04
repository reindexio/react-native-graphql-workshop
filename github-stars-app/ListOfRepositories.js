import React from 'react';
import { FlatList } from 'react-native';
import Repository from './Repository';

export default class ListOfRepositories extends React.Component {
  renderItem({ item }) {
    return <Repository />;
  }

  render() {
    const items = ['fake', 'fake-2'];
    return (
      <FlatList
        data={items}
        renderItem={this.renderItem}
        keyExtractor={(item, index) => index}
      />
    );
  }
}
