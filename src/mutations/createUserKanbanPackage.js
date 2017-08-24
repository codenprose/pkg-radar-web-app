import gql from 'graphql-tag'

export default gql`
  mutation createUserKanbanPackage(
    $ownerName: String!,
    $packageId: ID!,
    $packageName: String!,
    $status: String!,
    $username: String!
  ) {
    createUserKanbanPackage(
      ownerName: $ownerName,
      packageId: $packageId,
      packageName: $packageName,
      status: $status,
      username: $username
    ) {
      userKanbanPackage {
        ownerName
        packageId
        packageName
        status
        username
      }
    }
  }
`