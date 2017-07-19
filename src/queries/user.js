import gql from 'graphql-tag'

export default gql`
  query currentUser {
    user {
      id,
      avatar,
      username,
      name,
      email,
      packages,
      boards,
      subscriptions
    }
  }
`