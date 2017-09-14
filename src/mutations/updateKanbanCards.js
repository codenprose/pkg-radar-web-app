import gql from 'graphql-tag'

export default gql`
  mutation updateKanbanCards($username: String!, $kanbanCards: [KanbanCardInput!]!) {
    updateUser(username: $username, kanbanCards: $kanbanCards) {
      user {
        username
        kanbanCards {
          board
          ownerName
          packageName
        }
      }
    }
  }
`;