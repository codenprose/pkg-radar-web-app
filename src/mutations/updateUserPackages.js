import gql from 'graphql-tag'

export default gql`
  mutation updateUserPackages($id: ID!, $packages: [Json!]!) {
    updateUser(id: $id, packages: $packages) {
      id
      username
      kanbanBoards,
      kanbanLayouts,
      kanbanPackages
    }
  }
`;