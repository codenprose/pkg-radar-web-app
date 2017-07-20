import gql from 'graphql-tag'
import { KanbanPackage } from '../fragments'

export default gql`
  mutation updateUserPackagesStaging($packageId: ID!, $userId: ID!) {
    addToPackageOnUserStaging(
      packagesStagingPackageId: $packageId, 
      usersStagingUserId: $userId
    ) {
        packagesStaging {
          ...KanbanPackage
        }
      }
    }
  }
  ${KanbanPackage}
`