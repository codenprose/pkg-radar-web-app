import gql from 'graphql-tag'

export default gql`
  mutation updateUserBoards($username: String!, $kanbanBoards: [String!]!) {
    updateUser(username: $username, kanbanBoards: $kanbanBoards) {
      user {
        username
        kanbanBoards
      }
    }
  }
`;