import React from 'react';
import { gql, graphql } from 'react-apollo';
import ListOfRepositories from './ListOfRepositories';
import LoadingScreen from './LoadingScreen';

class StarredRepositories extends React.Component {
  static navigationOptions = {
    title: 'Starred repositories',
  };

  render() {
    if (this.props.data.loading) {
      return <LoadingScreen />;
    } else {
      return (
        <ListOfRepositories
          repositories={this.props.data.viewer.starredRepositories}
        />
      );
    }
  }
}

const StarredQuery = gql`
  query {
    viewer {
      name
      email
      starredRepositories(first: 10) {
        nodes {
          id
          nameWithOwner
          viewerHasStarred
        }
      }
    }
  }
`;

export default graphql(StarredQuery)(StarredRepositories);
