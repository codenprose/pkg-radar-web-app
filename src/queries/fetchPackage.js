import gql from 'graphql-tag'

export default gql`
  query fetchPackage($name: String!) {
    Package(name: $name) {
      id
      owner
      name
      avatar
      slug
      description
      homepageUrl
      license
      repoUrl
      issues
      stars
      lastCommit
      primaryLanguage
      pullRequests
      readme
      pullRequests
      readme
      tags {
        id
        name
      }
      recommendations
      lastRelease
      changelog
    }
  }
`