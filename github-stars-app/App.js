import React from 'react';
import { Platform } from 'react-native';
import { StackNavigator } from 'react-navigation';
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface,
} from 'react-apollo';
import config from './config';
import Profile from './Profile';
import StarredRepositories from './StarredRepositories';
import SearchRepositories from './SearchRepositories';

const networkInterface = createNetworkInterface({
  uri: 'https://api.github.com/graphql',
});

networkInterface.use([
  {
    applyMiddleware(req, next) {
      if (!req.options.headers) {
        req.options.headers = {};
      }
      req.options.headers['authorization'] = `bearer ${config.GITHUB_TOKEN}`;
      next();
    },
  },
]);

const apolloClient = new ApolloClient({
  networkInterface,
});

const Navigator = StackNavigator(
  {
    Profile: { screen: Profile },
    Starred: { screen: StarredRepositories },
    Search: { screen: SearchRepositories },
  },
  {
    cardStyle: {
      paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight,
    },
  },
);

export default class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={apolloClient}>
        <Navigator />
      </ApolloProvider>
    );
  }
}
