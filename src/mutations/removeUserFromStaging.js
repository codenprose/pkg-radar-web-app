import gql from 'graphql-tag'
import { KanbanPackage } from '../fragments'

export default gql`
  mutation removeUserFromStaging($userId: ID!, $packageId: ID!) {
    removeFromPackageOnUserStaging(
      usersStagingUserId: $userId,
      packagesStagingPackageId: $packageId
    ) {
        packagesStagingPackage {
          ...KanbanPackage
        }
      }
  }
  ${KanbanPackage}
`