import gql from 'graphql-tag'
import { KanbanPackage } from '../fragments'

export default gql`
  mutation removeUserFromBacklog($userId: ID!, $packageId: ID!) {
    removeFromPackageOnUserBacklog(
      usersBacklogUserId: $userId,
      packagesBacklogPackageId: $packageId
    ) {
        packagesArchivePackage {
          ...KanbanPackage
        }
      }
  }
  ${KanbanPackage}
`