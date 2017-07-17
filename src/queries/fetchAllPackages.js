import gql from 'graphql-tag'

export default gql`
  query fetchAllPackages($first: Int!, $orderBy: PackageOrderBy!) {
    allPackages(first: $first, orderBy: $orderBy) {
      id
      avatar
      name
      stars
      issues
    }
  }
`