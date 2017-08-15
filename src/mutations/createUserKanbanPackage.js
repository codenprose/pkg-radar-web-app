import gql from 'graphql-tag'

export default gql`
  mutation createUserKanbanPackage(
    $ownerName: String!,
    $packageId: ID!,
    $packageName: String!,
    $status: String!,
    $userId: ID!
  ) {
    createUserKanbanPackage(
      ownerName: $ownerName,
      packageId: $packageId,
      packageName: $packageName,
      status: $status,
      userId: $userId
    ) {
      userKanbanPackage {
        ownerName
        packageId
        packageName
        status
        userId
      }
    }
  }
`