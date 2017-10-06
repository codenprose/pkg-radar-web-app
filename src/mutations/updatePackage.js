import gql from 'graphql-tag'

export default gql`
  mutation updatePackage($owner: String!, $name: String!, $data: String!) {
    updatePackage(owner: $owner, name: $name, data: $data) {
      package {
        ownerName
        packageName,
        tags
      }
    }
  }
`