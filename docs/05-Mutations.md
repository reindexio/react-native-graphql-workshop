# Mutations

In this section we will make `Unstar` (and `Star`) buttons work. You can
continue your previous work or checkout `step-5` branch.

## Trying mutations in Explorer

The mutations that we are interested in are `addStar` and `removeStar`. They
accept one argument called `input`, which is an object with one field -
`starrableId`. The result of mutation (a *Payload*) contains `starrable` field,
which we will use to see if the update succeeded.

```graphql
mutation {
  addStar(input: { starrableId: "some-id" }) {
    starrable {
      id
      viewerHasStarred
      ... on Repository {
        nameWithOwner
      }
    }
  }
}
```

The `starrable` field of resulting payload doesn't return `Repository`. Rather
it returs `Starrable` interface. Therefore we need to add an inline fragment
that adds `nameWithOwner` field for all repository results (and we only expect
those results in this case).

## Buttons as containers

As with Redux, it's possible to have Apollo Containers in a non-root components.
Starring and unstarring of repositories are a pretty self-contained action, so
we can turn `Repository` into an Apollo Container so that we can call mutations
on it.

First we will add both AddStar and RemoveStar queries to the `Repository`. Note
that we moved the `id` to be a variable.

When attaching multiple GraphQL queries to one container, you need to keep
two things in mind. First, you need to pass a unique name so that the attached
query props differ. Second, you need to combine them using `compose` function.

```js
import { compose, graphql, gql } from 'react-apollo';

```

```js
const StarQuery = gql`
  mutation StarRepo($id: ID!) {
    addStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
        ... on Repository {
          nameWithOwner
        }
      }
    }
  }
`;

const UnStarQuery = gql`
  mutation UnstarRepo($id: ID!) {
    removeStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
        ... on Repository {
          nameWithOwner
        }
      }
    }
  }
`;

export default compose(
  graphql(StarQuery, { name: 'addStar' }),
  graphql(UnStarQuery, { name: 'removeStar' }),
)(Repository);

```

Unlike queries, mutations have a simpler API. They just add a prop, which is
a promise-returning function. The function accepts variables to send. Let's add
a method that will call one of these mutations and pass it to the buttons.

```js
class Repository extends React.Component {
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

  async handleToggleStar(mutation) {
    await this.props[mutation]({
      variables: {
        id: this.props.repository.id,
      },
    });
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

## Optimistic updates

You will probably notice, that there is no reaction to a button press and a
delay before it changes. This delay is because of the round-trip time between
our app and the server. In order to get around that, we need to add an
*optimistic response* to the mutation call. Optimistic response is like a fake
server response, with what we think should be the actual server response. It
will allow us to update the UI without a delay.

```js
async handleToggleStar(mutation) {
  await this.props[mutation]({
    variables: {
      id: this.props.repository.id,
    },
    optimisticResponse: {
      [mutation]: {
        __typename: 'AddStarPayload',
        starrable: {
          __typename: 'Repository',
          id: this.props.repository.id,
          viewerHasStarred: !this.props.repository.viewerHasStarred,
          nameWithOwner: this.props.repository.nameWithOwner,
        },
      },
    },
  });
}
```

We need to add `__typename` fields manually because `starrable` is an interface,
and Apollo needs to know it's Repository before it can update the store.
