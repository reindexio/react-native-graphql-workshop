# Introduction to GraphQL

This chapter focuses on introducing basics of GraphQL. If you already feel
confident about GraphQL, you should feel free to move to the
[second chapter](02-Installing_and_first_steps.md). This is a very abridged
crash course, please see [links section](../README.md#Links) for more in-depth
tutorials.

GraphQL is a new standard to write APIs for client-server communication. It
consist of a query language that describes what data a client needs and a server
that can interpret, validate and resolve the query. It also provides a server
description language, that makes it simpler to build servers and communicate
server capabilities to the client.

## Basic GraphQL

### Queries

Most often GraphQL APIs return JSON. It's very easy to get to GraphQL query
language by starting from JSON.

Let's imagine you need to receive the following data on your client:

```json
{
  "hello": "world"
}
```

To retrieve this data from a GraphQL server we just need to remove the values:

```graphql
query {
  hello
}
```

Often we need nested data for our views.

```json
{
  "user": {
    "name": "Mikhail Novikov",
    "email": "freiksenet@reindex.io",
    "stars": [
      {
        "name": "facebook/react"
      },
      {
        "name": "facebook/react-native"
      }
    ]
  }
}
```

GraphQL makes it very easy to fetch nested data in one request.

```graphql
query {
  user {
    name
    email
    stars {
      name
    }
  }
}
```

### Arguments and variables

Top level fields in GraphQL query (the ones which are directly after `query` or
`mutation` keywords, like `user` and `hello`) are root fields. One could think
of those root fields as of resources in, eg, a REST API or remote calls in RPC
systems. Very often those root fields need some additional information to
retrieve data, such as an id. It is possible to pass arguments to fields in
GraphQL.

```graphql
query {
  userById(id: "some-special-id") {
    name
    email
    stars {
      name
    }
  }
}
```

While root fields are the fields that have arguments most often, other fields
can also accept them.

```graphql
query {
  userById(id: "some-special-id") {
    name
    email
    picture(size: LARGE)
    stars(limit: 10) {
      name
    }
  }
}
```

It's often very useful to decouple argument values from the queries. For this,
GraphQL has variables. Variables are first declared at top of the query and then
can be used anywhere in the query. When GraphQL is queried, one can pass
variable values along with the query. Variable names always start with a `$`.

```graphql
query($id: ID!, $starLimit: Int) {
  userById(id: $id) {
    name
    email
    picture(size: LARGE)
    stars(limit: $starLimit) {
      name
    }
  }
}
```

### Fragments

Parts of the query is often repeated through out the project. Certain components
will need certain data. It's useful to follow DRY and to keep those parts of
the query separate. For that purpose GraphQL has fragments. Fragment is typed
against certain type and can be included in other queries or fragments.

```graphql
query($id: ID!, $starLimit: Int) {
  userById(id: $id) {
    ...UserFragment
  }
}

fragment UserFragment on User {
  name
  email
  picture
  stars(limit: $starLimit) {
    ...StarFragment
  }
}

fragment StarFragment on Starrable {
  name
}
```

### Mutations

So far we only had examples of queries, which are idempotent and are meant to
only return data. However, often you also need to change something and for this
there are mutations. Mutations are similar to query, they have a root and a
selection set under it. They also return the data same way. However the
 difference is that mutation root fields are allowed to perform side effects.
Note that only mutation inputs really have an effect on that, selection set is
there only to see how the changes propagated.

```graphql
mutation {
  addStar(input: { starrableId: "some-id" }) {
    starrable {
      viewerHasStarred
    }
  }
}
```

## Github GraphQL API

In this project, we are going to use Github GraphQL API. Github has a [GraphQL
explorer](https://developer.github.com/v4/explorer/), that would be very useful
for us to prototype our queries before using it.

Github API is structured through a *Viewer pattern*. There is a root field
called `viewer` that refers to a currently logged-in user, so one can browse
own repositories. In addition `viewer` is referred through-out the API to see
their relation to some object. Eg, `Starrable` objects have field
`viewerHasStarred`, which indicates whether it is starred by current user.

## GraphQL clients and Apollo

While it's possible to use most GraphQL APIs with just an HTTP client, GraphQL
clients can often offer additional benefits and a simpler API. For example,
they can provide a smart local cache for the query results and pass those
results in a convenient manner. In addition, they usually handle simple updates
from mutations automatically.

We are going to be using Apollo Client in this workshop. It's a simple, yet
powerful GraphQL client for Javascript. It has great React and React Native
integration.

One popular alternative client is Relay from Facebook. It has certain advanced
features, which make writing certain applications easier. However, it's API
surface is more complex than Apollo and we've decided not to cover it in this
workshop.
