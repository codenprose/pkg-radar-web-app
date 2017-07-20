import gql from 'graphql-tag'
import { KanbanPackage } from '../fragments'

export default gql`
  mutation updateUserPackagesArchive($packageId: ID!, $userId: ID!) {
    addToPackageOnUserArchive(
      packagesArchivePackageId: $packageId, 
      usersArchiveUserId: $userId
    ) {
        packagesArchive {
          ...KanbanPackage
        }
      }
    }
  }
  ${KanbanPackage}
`