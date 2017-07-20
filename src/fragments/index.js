import { gql } from 'react-apollo'

const PackageFragment = gql`
  fragment PackageFragment on Package {
    id
    name
    avatar,
    description,
    stars
  }
`

const UserFragment = gql`
  fragment UserFragment on User {
    id
    avatar
    username
    name
    email
    kanbanBoards
    kanbanLayouts
    packagesBacklog {
      ...PackageFragment
    }
    packagesStaging {
      ...PackageFragment
    }
    packagesProduction {
      ...PackageFragment
    }
    packagesArchive {
      ...PackageFragment
    }
    subscriptions
  }
  ${PackageFragment}
`;

const KanbanPackage = gql`
  fragment KanbanPackage on Package {
    id
    name
    avatar
    description
    stars
  }
`;

export { 
  UserFragment, 
  KanbanPackage 
}