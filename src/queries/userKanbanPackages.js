import gql from 'graphql-tag'

export default gql`
  query getUserKanbanPackages($userId: ID!) {
    userKanbanPackages(payload: { userId: $userId }) {
      color
      description
      issues
      language
      ownerAvatar
      ownerName
      packageId
      packageName
      status
      stars
      userId
    }
  }
`