import React from 'react';
import ListOfRepositories from './ListOfRepositories';

export default class StarredRepositories extends React.Component {
  static navigationOptions = {
    title: 'Starred repositories',
  };

  render() {
    return <ListOfRepositories />;
  }
}
