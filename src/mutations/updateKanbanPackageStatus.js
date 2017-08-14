import gql from 'graphql-tag'

export default gql`
  mutation updateKanbanPackageStatus($packageId: ID!, $status: String!, $userId: ID!) {
    updateUserKanbanPackage(packageId: $packageId, status: $status, userId: $userId) {
      userKanbanPackage {
        packageId
        status
        userId
      }
    }
  }
`