import gql from 'graphql-tag'


export default gql`
  mutation signinUser ($idToken: String!) {
    signinUser(auth0: { idToken: $idToken }) {
      user {
        id
      }
    }
  }
`