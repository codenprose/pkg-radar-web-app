import gql from 'graphql-tag'

export default gql`
  mutation deleteUserKanbanPackage($packageId: ID!, $username: String!) {
    deleteUserKanbanPackage(packageId: $packageId, username: $username) {
      userKanbanPackage {
        ownerName
        packageId
        packageName
        username
      }
    }
  }
`