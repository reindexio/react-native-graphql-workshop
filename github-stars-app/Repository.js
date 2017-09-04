import React from 'react';
import { compose, graphql, gql } from 'react-apollo';
import { Text, View, StyleSheet, Button } from 'react-native';

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

const styles = StyleSheet.create({
  container: {
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderColor: 'lightgray',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: 15,
  },
  button: {
    height: 35,
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

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
