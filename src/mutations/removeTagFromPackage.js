import gql from 'graphql-tag'
import { PackageFragment } from '../fragments'

export default gql`
  mutation removeTagFromPackage($tagId: ID!, $packageId: ID!) {
    removeFromTagOnPackage(tagsTagId: $tagId, packagesPackageId: $packageId) {
      packagesPackage {
        ...PackageFragment
      }
    }
  }
  ${PackageFragment}
`