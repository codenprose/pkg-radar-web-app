import gql from 'graphql-tag'

export default gql`
  query getUser($username: String!) {
    user(payload: { username: $username }) {
      avatar
      bio
      connections {
        username
      }
      company
      id
      kanbanBoards
      kanbanCards {
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