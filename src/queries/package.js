import gql from 'graphql-tag'

export default gql`
  query getPackage($ownerName: String!, $packageName: String!) {
    package(payload: { ownerName: $ownerName, packageName: $packageName}) {
      archive
      backlog
      color
      description
      id
      issues
      language
      lastCommit {
        author {
          date
          name
        }
        commitUrl
        message
      }
      lastRelease {
        name
        description
        publishedAt
        url
      }
      license
      mentionableUsers
      ownerAvatar
      ownerName
      packageName
      production
      pullRequests
      readme {
        extension
        text
      }
      repoUrl
      stars
      tags {
        tagName
      }
      trial
      websiteUrl
    }
  }
`