import gql from 'graphql-tag'

export default gql`
  query getUserConnections($username: String!) {
    userConnections(payload: { username: $username }) {
      avatar
      bio
      name
      username
    }
  }
`