import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { gql, graphql } from 'react-apollo';
import LoadingScreen from './LoadingScreen';

class Profile extends React.Component {
  static navigationOptions = {
    title: 'Github Stars App',
  };

  render() {
    if (this.props.data.loading) {
      return <LoadingScreen />;
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.textBlock}>
            <Text style={styles.text}>
              Username: {this.props.data.viewer.login}
            </Text>
            <Text style={styles.text}>
              Name: {this.props.data.viewer.name}
            </Text>
          </View>
          <View style={styles.buttonBlock}>
            <Button
              title="Starred repositories"
              onPress={() => this.props.navigation.navigate('Starred')}
            />
          </View>
          <View style={styles.buttonBlock}>
            <Button
              title="Search for repositories"
              onPress={() => this.props.navigation.navigate('Search')}
            />
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  textBlock: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
  },
  buttonBlock: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'center',
  },
});

const ProfileQuery = gql`
  query {
    viewer {
      login
      name
    }
  }
`;

export default graphql(ProfileQuery)(Profile);
