import gql from 'graphql-tag'
import { KanbanPackage } from '../fragments'

export default gql`
  mutation removeUserFromArchive($userId: ID!, $packageId: ID!) {
    removeFromPackageOnUserArchive(
      usersArchiveUserId: $userId,
      packagesArchivePackageId: $packageId
    ) {
        packagesArchivePackage {
          ...KanbanPackage
        }
      }
  }
  ${KanbanPackage}
`