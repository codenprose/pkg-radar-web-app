import gql from 'graphql-tag'

export default gql`
  query getCurrentUser($username: String!, $token: String!) {
    currentUser(payload: { username: $username, token: $token }) {
      avatar
      bio
      company
      id
      kanbanBoards
      kanbanCardPositions {
        board
        ownerName
        packageName
        status
      }
      name
      totalPackages
      totalSubscriptions
      username
      website
    }
  }
`