import gql from 'graphql-tag'

export default gql`
  mutation updateUserKanbanLayouts($id: ID!, $kanbanLayouts: [Json!]!) {
    updateUser(id: $id, kanbanLayouts: $kanbanLayouts) {
      kanbanLayouts
    }
  }
`;