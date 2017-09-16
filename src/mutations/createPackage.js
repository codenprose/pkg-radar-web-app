import gql from 'graphql-tag'

export default gql`
  mutation createPackage($owner: String!, $name: String!, $createdBy: String!) {
    createPackage(owner: $owner, name: $name, createdBy: $createdBy) {
      package {
        ownerName
        packageName
      }
    }
  }
`