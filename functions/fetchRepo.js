"use latest"
const fetch = require('isomorphic-fetch')

module.exports = function (event) {
  const eventData = event.data
  const repoUrl = eventData.repoUrl
  const [owner, name] = repoUrl.replace('https://github.com/', '').split('/')

  const fetchRepoQuery = `
    query ($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        id
        url
        homepageUrl
        stargazers {
          totalCount
        }
        issues {
          totalCount
        }
        pullRequests {
          totalCount
        }
        description
        license
        primaryLanguage {
          name
          color
        }
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
        readme: object(expression: "master:README.md") {
          ... on Blob {
            text
          }
        }
        changelog: object(expression: "master:CHANGELOG.md") {
          ... on Blob {
            text
          }
        }
        lastCommit: ref(qualifiedName: "master") {
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

  const requestBody = {
    query: fetchRepoQuery,
    variables: { owner, name }
  }

  const requestOptions = {
  	method: 'POST',
    body: JSON.stringify(requestBody),
    headers: {
      Authorization: `bearer 60bdf743c601915ebb65d1e238c9fefaedb88af2`
    }
  }
    
  return fetch('https://api.github.com/graphql', requestOptions)
    .then((response) => {
      if (response.ok) {
        return response.json()
      } else if ('statusText' in response) {
        throw new Error(response.statusText)
      } else {
        throw new Error('error')
      }
    })
    .then((githubData) => {
      const { data: { repository } } = githubData

      eventData.changelog = repository.changelog
      eventData.description = repository.description
      eventData.homepageUrl = repository.homepageUrl
      eventData.issues = repository.issues.totalCount
      eventData.lastCommit = repository.lastCommit.target.history.edges[0].node
      eventData.lastRelease = repository.releases.edges[0].node
      eventData.license = repository.license
      eventData.name = repository.name
      eventData.primaryLanguage = repository.primaryLanguage
      eventData.pullRequests = repository.pullRequests.totalCount
      eventData.readme = repository.readme
      eventData.repoUrl = repository.url
      eventData.stars = repository.stargazers.totalCount

      return { data: eventData }
    })
    .catch((err) => {
      console.error(err.message)
      eventData.error = err.message
      return { data: eventData }
    })
}