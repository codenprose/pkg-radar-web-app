"use latest"
const fetch = require('isomorphic-fetch')

module.exports = function (event) {
  const eventData = event.data
  const repoUrl = eventData.repoUrl
  const arr = repoUrl.replace('https://github.com/', '').split('/')
  const owner = arr[0]
  const name = arr[1]

  const fetchRepoQuery = `
    query ($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        id
        url
        owner {
          avatarUrl
        }
        name
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
        releases(last: 1) {
          edges {
            node {
              name
              publishedAt
              description
              url
            }
          }
        }
        README: object(expression: "master:README.md") {
          ... on Blob {
            text
          }
        }
    		Readme: object(expression: "master:Readme.md") {
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

      eventData.owner = owner
      eventData.avatar = repository.owner.avatarUrl
      eventData.description = repository.description
      eventData.homepageUrl = repository.homepageUrl
      eventData.issues = repository.issues ? repository.issues.totalCount : 0
      eventData.lastCommit = repository.lastCommit.target.history.edges[0].node
      eventData.license = repository.license
      eventData.name = name
      eventData.primaryLanguage = repository.primaryLanguage
      eventData.pullRequests = repository.pullRequests ? repository.pullRequests.totalCount : 0
      eventData.repoUrl = repository.url
      eventData.stars = repository.stargazers ? repository.stargazers.totalCount : 0

      if (repository.README) {
        eventData.readme = repository.README.text
      } else if (repository.Readme) {
        eventData.readme = repository.Readme.text
      }

      if (repository.releases.edges.length) {
        eventData.lastRelease =  repository.releases.edges[0].node
      } 

      if (repository.changelog) {
        eventData.changelog = repository.changelog.text
      }

      // console.log(githubData)
      return { data: eventData }
    })
    .catch((err) => {
      console.error(err.message)
      eventData.error = err.message
      return { data: eventData }
    })
}