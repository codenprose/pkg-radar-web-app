import gql from 'graphql-tag'

export default gql`
  mutation deleteUserKanbanPackage($packageId: ID!, $userId: ID!) {
    deleteUserKanbanPackage(packageId: $packageId, userId: $userId) {
      userKanbanPackage {
        ownerName
        packageId
        packageName
        userId
      }
    }
  }
`