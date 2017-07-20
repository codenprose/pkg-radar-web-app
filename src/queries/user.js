import { gql } from "react-apollo";

import { UserFragment } from "../fragments";

export default gql`
  query currentUser {
    user {
      ...UserFragment
    }
  }
  ${UserFragment}
`;