import React from 'react';
import { FlatList } from 'react-native';
import Repository from './Repository';

export default class ListOfRepositories extends React.Component {
  renderItem({ item }) {
    return <Repository repository={item} />;
  }

  render() {
    return (
      <FlatList
        data={this.props.repositories.nodes}
        renderItem={this.renderItem}
        keyExtractor={item => item.id}
      />
    );
  }
}
