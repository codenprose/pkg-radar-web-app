import gql from 'graphql-tag'

export default gql`
  query fetchPackages($first: Int!, $orderBy: PackageOrderBy!, $tag: String!) {
    allPackages(
      first: $first, 
      orderBy: $orderBy
      filter: {tags_some: {name: $tag}}
    ) {
      id
      avatar
      name
      owner
      stars
      issues
      primaryLanguage
    }
  }
`