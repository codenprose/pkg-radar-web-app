import gql from 'graphql-tag'

export default gql`
  query getUserKanbanPackages($username: String!) {
    userKanbanPackages(payload: { username: $username }) {
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