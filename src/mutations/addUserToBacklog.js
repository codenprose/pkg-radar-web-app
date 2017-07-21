import gql from 'graphql-tag'
import { KanbanPackage } from '../fragments'

export default gql`
  mutation addPackageToBacklog($userId: ID!, $packageId: ID!) {
    addToPackageOnUserBacklog(
      usersBacklogUserId: $userId,
      packagesBacklogPackageId: $packageId,
    ) {
        packagesBacklogPackage {
          ...KanbanPackage
        }
      }
    }
  }
  ${KanbanPackage}
`