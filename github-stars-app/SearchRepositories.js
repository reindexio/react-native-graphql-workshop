import React from 'react';
import { gql, graphql } from 'react-apollo';
import { View, TextInput, StyleSheet, Button } from 'react-native';
import ListOfRepositories from './ListOfRepositories';
import LoadingScreen from './LoadingScreen';

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

  handlePerformSearch = () => {
    if (this.state.searchText.length > 3) {
      this.setState({
        activeSearch: this.state.searchText,
      });
    }
  };

  renderResult() {
    if (this.state.activeSearch) {
      return (
        <SearchRepositoriesResultContainer
          searchText={this.state.activeSearch}
        />
      );
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
          <Button title="Search" onPress={this.handlePerformSearch} />
        </View>
        {this.renderResult()}
      </View>
    );
  }
}

class SearchRepositoriesResult extends React.Component {
  loadMoreEntries = () => {
    // Don't repeat it when loading
    if (!this.props.loading) {
      const search = this.props.data.search;
      // if there is no more data, do nothing
      if (!search.pageInfo.hasNextPage) {
        return;
      }
      return this.props.data.fetchMore({
        query: SearchQuery,
        variables: {
          // pass current last cursor
          cursor: search.pageInfo.endCursor,
          query: this.props.searchText,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newItems = fetchMoreResult.search.nodes;
          return {
            // return the update set
            search: {
              ...fetchMoreResult.search,
              // append newly received items to the old ones
              nodes: [...previousResult.search.nodes, ...newItems],
            },
          };
        },
      });
    }
  };

  render() {
    if (this.props.data.loading) {
      return <LoadingScreen />;
    } else {
      return (
        <ListOfRepositories
          repositories={this.props.data.search}
          refreshing={this.props.data.loading}
          onRefresh={() => this.props.data.refetch()}
          onLoadMore={this.loadMoreEntries}
        />
      );
    }
  }
}

const SearchQuery = gql`
  query SearchQuery($cursor: String, $query: String!) {
    search(type: REPOSITORY, query: $query, first: 10, after: $cursor) {
      repositoryCount
      nodes {
        ... on Repository {
          id
          nameWithOwner
          viewerHasStarred
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

const SearchRepositoriesResultContainer = graphql(SearchQuery, {
  options: props => {
    return {
      variables: {
        query: props.searchText,
      },
    };
  },
})(SearchRepositoriesResult);

const styles = StyleSheet.create({
  inputContainer: {
    paddingTop: 15,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },
  input: {
    backgroundColor: 'white',
    fontSize: 15,
    height: 40,
    paddingHorizontal: 5,
  },
});
