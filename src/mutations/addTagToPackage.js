import gql from 'graphql-tag'
import { PackageFragment } from '../fragments'

export default gql`
  mutation addTagToPackage($tagId: ID!, $packageId: ID!) {
    addToTagOnPackage(tagsTagId: $tagId, packagesPackageId: $packageId) {
      packagesPackage {
        ...PackageFragment
      }
    }
  }
  ${PackageFragment}
`