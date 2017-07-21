import gql from 'graphql-tag'
import { KanbanPackage } from '../fragments'

export default gql`
  mutation addPackageToStaging($userId: ID!, $packageId: ID!) {
    addToPackageOnUserStaging(
      usersStagingUserId: $userId,
      packagesStagingPackageId: $packageId
    ) {
        packagesStagingPackage {
          ...KanbanPackage
        }
      }
    }
  }
  ${KanbanPackage}
`