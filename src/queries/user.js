import gql from 'graphql-tag'

export default gql`
  query getUser($username: String!) {
    user(payload: { username: $username }) {
      avatar
      bio
      company
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