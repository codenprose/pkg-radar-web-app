import gql from 'graphql-tag'

export default gql`
  mutation deleteUserConnection($user: String!, $connection: String!) {
    deleteUserConnection(user: $user, connection: $connection) {
      userConnection {
        username
      }
    }
  }
`