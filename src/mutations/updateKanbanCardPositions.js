import gql from 'graphql-tag'

export default gql`
  mutation updateKanbanCardPositions($username: String!, $kanbanCardPositions: [KanbanCardInput!]!) {
    updateUser(username: $username, kanbanCardPositions: $kanbanCardPositions) {
      user {
        username
        kanbanCardPositions {
          board
          ownerName
          packageName
        }
      }
    }
  }
`;