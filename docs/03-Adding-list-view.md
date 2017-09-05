# Adding list view

In this section we will add data to the `StarredRepositories`. You can
continue from previous step or checkout `step-2` branch.

## Designing the query

We will start by designing the query that we need to get all the data in the
[GraphQL Explorer](https://developer.github.com/v4/explorer/). We need to get the list of starred repositories of
the current user and the name for them so we could display them in the list.

We will start with `viewer` to get info about current user.
`starredRepositories` is a so-called *Connection*, a paginated list of
repositories that user starred. We will discuss all the fields in the
*Connection* later. At this moment we would need to pass mandatory argument
`first`, which acts like limit and then use `nodes` field to get the list of
items. The reason why `starredRepository` doesn't return the array directly is
that it contains fields that provide information about pagination.  We will
request `id`, `nameWithOwner` and `viewerHasStarred` fields. The last field
 indicates whether we have starred the repository, we will include it so it's
easy to track whether we starred or unstarred a particular repository.

```graphql
query {
  viewer {
    login
    name
    starredRepositories(first: 10) {
      nodes {
        id
        nameWithOwner
        viewerHasStarred
      }
    }
  }
}
```

Now we can add that query to `StarredRepositories`. First we need to add
Apollo imports to the top.

```js
import { gql, graphql } from 'react-apollo';
```

Now, under the component add the query using the `gql` template tag.

```js
const StarredQuery = gql`
  query {
    viewer {
      login
      name
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
```

Now we can use this query to create a GraphQL container out of our component.
Don't forget to remove `export default` from original component.

```js
export default graphql(StarredQuery)(StarredRepositories);
```

The component should have data props now. Let's make it pass the actual data
to subcomponents now. We will also add a loading check and a loading indicator.

```js
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
```

`ListOfRepositories` and `Repositories` now should be updated to use the passed
props.

```js
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

```

```js
export default class Repository extends React.Component {
  renderStarToggle() {
    if (this.props.repository.viewerHasStarred) {
      return (
        <Button
          title="Unstar"
          onPress={() => this.handleToggleStar('removeStar')}
        />
      );
    } else {
      return (
        <Button title="Star" onPress={() => this.handleToggleStar('addStar')} />
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          {this.props.repository.nameWithOwner}
        </Text>
        {this.renderStarToggle()}
      </View>
    );
  }
}
```

Now Starred Repositories view should display 10 oldest repositories that you
have starred.
