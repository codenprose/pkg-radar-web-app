import gql from 'graphql-tag'

import { UserFragment } from '../fragments'

export default gql`
  mutation signInUser ($idToken: String!) {
    signinUser(auth0: { idToken: $idToken }) {
      user {
        ...UserFragment
      }
    }
  }
  ${UserFragment}
`