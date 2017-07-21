import gql from 'graphql-tag'
import { KanbanPackage } from '../fragments'

export default gql`
  mutation removeUserFromProduction($userId: ID!, $packageId: ID!) {
    removeFromPackageOnUserProduction(
      usersProductionUserId: $userId,
      packagesProductionPackageId: $packageId
    ) {
        packagesProductionPackage {
          ...KanbanPackage
        }
      }
  }
  ${KanbanPackage}
`