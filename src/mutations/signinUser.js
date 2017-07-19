import gql from 'graphql-tag'

export default gql`
  mutation signInUser ($idToken: String!) {
    signinUser(auth0: { idToken: $idToken }) {
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
  }
`