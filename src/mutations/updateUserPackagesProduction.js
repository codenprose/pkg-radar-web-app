import gql from 'graphql-tag'
import { KanbanPackage } from '../fragments'

export default gql`
  mutation updateUserPackagesProduction($packageId: ID!, $userId: ID!) {
    addToPackageOnUserProduction(
      packagesProductionPackageId: $packageId, 
      usersProductionUserId: $userId
    ) {
        packagesProduction {
          ...KanbanPackage
        }
      }
    }
  }
  ${KanbanPackage}
`