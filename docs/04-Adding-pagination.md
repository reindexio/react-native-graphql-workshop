# Adding pagination

In this section we will update `StarredRepositories` to have pagination and
pull to refresh. You can continue from previous step or checkout `step-3`
branch.

## Connection pattern

In modern apps, there are rarely distinct pages, but often things are infinitely
scrollable and we need to be able to know whether new stuff appeared. Connection
pattern in GraphQL aims to solve those problems. Instead of separating data
by pages, it allows requesting more data by specifying the last element you have
seen. Specifying the element is done through a "cursor", a special string that
you can request from a Connection.

In addition, a connection has a field called `pageInfo`, which allows querying
for whether the next page of data is available. In addition, it conveniently
includes the cursor to the last item of the current page.

## Expanding query to include pagination info

We need to be able to pass a cursor to the `after` parameter of the connection.
We will create a `cursor` variable and pass it there. In addition, we will query
the pageInfo and check if next page is available, as well as the last cursor.

```js
const StarredQuery = gql`
  query( $cursor: String) {
    viewer {
      login
      name
      starredRepositories(first: 10, after: $cursor) {
        totalCount
        nodes {
          id
          nameWithOwner
          viewerHasStarred
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;
```

## Implementing pagination logic inside Apollo Client

Now we need to teach Apollo Client to understand how to query for more data.
Apollo Client provides `fetchMore` method on the `data` prop, that provides a
customizable way to fetch more data. We need to pass `fetchMore` the parameters
of the query, as well as the `updateQuery` function, that will return a result
that will be merged with data currently stored in our store. We will create a
method that calls `fetchMore`.

```js
loadMoreEntries = () => {
  // Don't repeat it when loading
  if (!this.props.data.loading) {
    const viewer = this.props.data.viewer;
    // if there is no more data, do nothing
    if (!viewer.starredRepositories.pageInfo.hasNextPage) {
      return;
    }
    return this.props.data.fetchMore({
      query: StarredQuery,
      variables: {
        // pass current last cursor
        cursor: viewer.starredRepositories.pageInfo.endCursor,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const newItems = fetchMoreResult.viewer.starredRepositories.nodes;
        return {
          // return the update set
          viewer: {
            ...fetchMoreResult.viewer,
            starredRepositories: {
              ...fetchMoreResult.viewer.starredRepositories,
              // append newly received items to the old ones
              nodes: [
                ...previousResult.viewer.starredRepositories.nodes,
                ...newItems,
              ],
            },
          },
        };
      },
    });
  }
};
```

We will pass this method to `ListOfRepositories`:

```js
return (
  <ListOfRepositories
    repositories={this.props.data.viewer.starredRepositories}
    onLoadMore={this.loadMoreEntries}
  />
);
```

And we call it when the end of the list is reached inside it:

```js
render() {
  return (
    <FlatList
      data={this.props.repositories.nodes}
      renderItem={this.renderItem}
      onEndReached={() => this.props.onLoadMore()}
    />
  );
}
```

To add pull to refresh, we will just pass the callback that will call another
Apollo `data` method - `refetch`. We will also pass the loading state so that
pull to refresh can indicate when it's loading.

```js
return (
  <ListOfRepositories
    repositories={this.props.data.viewer.starredRepositories}
    onLoadMore={this.loadMoreEntries}
    onRefresh={() => this.props.data.refetch({ first: 20 })}
    refreshing={this.props.data.loading}
  />
);
```

And in `ListOfRepositories`

```js
render() {
  return (
    <FlatList
      data={this.props.repositories.nodes}
      renderItem={this.renderItem}
      keyExtractor={item => item.id}
      onEndReached={() => this.props.onLoadMore()}
      refreshing={this.props.refreshing}
      onRefresh={() => this.props.onRefresh()}
    />
  );
}
```
