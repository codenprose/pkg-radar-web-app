import gql from 'graphql-tag'

export default gql`
  mutation createUserConnection($user: String!, $connection: String!) {
    createUserConnection(user: $user, connection: $connection) {
      userConnection {
        username
      }
    }
  }
`