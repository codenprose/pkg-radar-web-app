import gql from 'graphql-tag'

export default gql`
  mutation updateKanbanPackageStatus($packageId: ID!, $status: String!, $username: String!) {
    updateUserKanbanPackage(packageId: $packageId, status: $status, username: $username) {
      userKanbanPackage {
        packageId
        status
        username
      }
    }
  }
`