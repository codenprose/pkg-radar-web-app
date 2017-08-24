import gql from 'graphql-tag'

export default gql`
  mutation createPackage($owner: String!, $name: String!, $username: String!) {
    createPackage(owner: $owner, name: $name, username: $username) {
      package {
        ownerName
        packageName
      }
    }
  }
`