"use latest"
const fetch = require('isomorphic-fetch')

module.exports = function (event) {
  const responseData = event.data
  const repoUrl = responseData.repoUrl
  const [owner, name] = repoUrl.replace('https://github.com/', '').split('/')

  const fetchRepoQuery = `
     query fetchRepo ($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
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
        license
        description
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
      const {
        url, homepageUrl, stargazers, issues, pullRequests,
        license, description, primaryLanguage, ref, releases,
      } = repository

      responseData.description = description
      responseData.homepageUrl = homepageUrl
      responseData.issues = issues.totalCount
      responseData.lastCommit = ref.target.history.edges[0].node
      responseData.lastRelease = releases.edges[0].node
      responseData.license = license
      responseData.name = name
      responseData.primaryLanguage = primaryLanguage
      responseData.pullRequests = pullRequests.totalCount
      responseData.repoUrl = url
      responseData.stars = stargazers.totalCount

      return { data: responseData }
    })
    .catch((err) => {
      console.error(err.message)
      responseData.error = err.message
      return { data: responseData }
    })
}