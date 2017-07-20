import gql from 'graphql-tag'
import { KanbanPackage } from '../fragments'

export default gql`
  mutation updateUserPackagesBacklog($packageId: ID!, $userId: ID!) {
    addToPackageOnUserBacklog(
      packagesBacklogPackageId: $packageId, 
      usersBacklogUserId: $userId
    ) {
        packagesBacklog {
          ...KanbanPackage
        }
      }
    }
  }
  ${KanbanPackage}
`