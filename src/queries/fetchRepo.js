import gql from 'graphql-tag'


export default gql`
  query fetchRepo ($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      stargazers {
        totalCount
      }
      issues {
        totalCount
      }
      pullRequests {
        totalCount
      }
      license
      releases(first: 1) {
        edges {
          node {
            name
            publishedAt
            description
            url
          }
        }
      }
      ref(qualifiedName: "master") {
        target {
          ... on Commit {
            history(first: 1) {
              edges {
                node {
                  commitUrl
                  oid
                  message
                  author {
                    name
                    email
                    date
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`