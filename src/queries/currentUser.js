import gql from 'graphql-tag'

export default gql`
  query getCurrentUser($username: String!, $token: String!) {
    currentUser(payload: { username: $username, token: $token }) {
      avatar
      bio
      company
      connections {
        username
      }
      id
      kanbanBoards
      kanbanCardPositions {
        board
        ownerName
        packageName
      }
      name
      totalPackages
      totalSubscriptions
      username
      website
    }
  }
`