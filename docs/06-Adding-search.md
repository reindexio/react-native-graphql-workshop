# Adding search

In this section we will add search repositories functionality. You can continue
your previous work or checkout `step-6`.

## Query

Search query is similar to StarredQuery in many ways. However, there are some
differences. The root field is called `search`. In addition to cursor, we
need to pass a `query` parameter with a search term.

```graphql
query {
  search(type: REPOSITORY, query: "freiksenet", first: 10) {
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
```

## Container

We will separate the `SearchRepository` into two components. One will handle
the search input state and then render a result. Result will actually be an
Apollo Container performing the data fetches.

First import the requirements:

```js
import { gql, graphql } from 'react-apollo';
```

We will pass the search string to the container comporent as props. With
`options` parameter, it's possible to customize the variables that are passed
to the query, and here we will make the query receive search from props.

```js
class SearchRepositoriesResult extends React.Component {
  loadMoreEntries() {
    // See below
  }

  render() {
    if (this.props.data.loading) {
      return <LoadingScreen />;
    } else {
      return (
        <ListOfRepositories
          repositories={this.props.data.search}
          refreshing={this.props.data.loading}
          onRefresh={() => this.props.data.refetch({
            query: this.props.searchText,
          })}
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
```

One part left is to implement `loadMoreEntries` here, similarly to how it is
implemented in `StarredRepositories`.

```js
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
            nodes: [
              ...previousResult.search.nodes,
              ...newItems,
            ],
          },
        };
      },
    });
  }
};
```

Lastly, we will update the actual exported component to perform search when
the search button is pressed.

```js
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
```

# The end

Our app is done. Notice, how by making `Repository` a container, we didn't need
to add any extra logic for starring or unstarring repositories in the search.
