import gql from 'graphql-tag'

export default gql`
  mutation loginUser($username: String!, $token: String!) {
    loginUser(username: $username, token: $token) {
      user {
        avatar
        bio
        company
        id
        name
        totalPackages
        totalSubscriptions
        username
        website
      }
    }
  }
`