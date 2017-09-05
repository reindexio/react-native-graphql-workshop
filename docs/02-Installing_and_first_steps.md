# Installing and first steps

## Clone the repo and install dependencies

You need to clone the repository and install the dependencies.

```
git clone https://github.com/reindexio/react-native-graphql-workshop.git
cd react-native-graphql-workshop/github-stars-app
git checkout step-1
npm install
```

The code lives in `github-stars-app` directory and the instructions assume you
are inside it.

## Get a GitHub token

*NB*: We *are* using production Github API :) You will *certainly* star and
 unstar repos a lot in this exercise, which will pollute your Github stream.
If you care about that kind of thing, I recommend creating a new Github account
for this project.

The demo app doesn't have any authentication built in, so you need to provide
it a Github API token. Follow [this guide](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/)
to create the token. You need to have `user` and `public_repo` scope for this
project.

Copy `config.template.js` to `config.js`. Change `GITHUB_TOKEN` in it to your
token.

## Install Expo on your phone

[Expo](https://expo.io) is the easiest way to run React Native apps on your
phone. Install the app on your iPhone or Android phone. After the app is
installed, you should start the development server:

```
npm start
```

You will see the QR code in your terminal. Open Expo app and scan the QR code.
The app should now be running on your phone. You should see text "You name is:
<YOUR GITHUB USERNAME>"

## Code structure

`App.js` is the main App component that React Native is rendering. It creates a
network interface with the server URL, initializes an instance of ApolloClient,
and attaches that to our React component tree with ApolloProvider. If you’ve
used Redux, this should be familiar, since it’s similar to how the Redux
provider works.

We use [react-navigation](https://reactnavigation.org) as a navigation solution and it's already set
up. In addition, 3 screens are set up in the navigation - `Profile`,
`StarredRepositories` and `SearchRepositories`. However, `StarredRepositories`
and `SearchRepositories` only have stub components, with no logic or props
attached, only basic structure and styles. In addition, components `Repository`
and `ListOfRepositories` also contain stubs. There is also a `LoadingScreen`
component that contains a styled loading indicator.

Let's take a look at `Profile` component. It's already wrapped into Apollo
Client Container. We define the query we want to send to our GraphQL backend
 and attach it to the actual React component through `graphql` function. The
 data will be passed as `data` prop to the component. `data` holds both the
 actual information (under the appropriate root key) and the loading state. In
 actual component we check if the data finished loading and render the
component using the props.

## Modifying the view to add more user info

To request more data from the server we need to modify the `ProfileQuery`. Let's
request `name` from the user in addition to the `login`.

```js
const ProfileQuery = gql`
  query {
    viewer {
      login
      name
    }
  }
`;
```

Now the data should be available in the props. Let's modify the component to
display the full name too.

```js
<View style={styles.textBlock}>
  <Text style={styles.text}>
    Username: {this.props.data.viewer.login}
  </Text>
  <Text style={styles.text}>
    Name: {this.props.data.viewer.name}
  </Text>
</View>
```

The app should autoupdate on your phone and display the name. If the app doesn't autoupdate, shake your phone wildly and click on "reload" button.
