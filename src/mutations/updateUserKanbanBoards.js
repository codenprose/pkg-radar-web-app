import gql from 'graphql-tag'

export default gql`
  mutation updateUserBoards($id: ID!, $kanbanBoards: [String!]!) {
    updateUser(id: $id, kanbanBoards: $kanbanBoards) {
      kanbanBoards
    }
  }
`;