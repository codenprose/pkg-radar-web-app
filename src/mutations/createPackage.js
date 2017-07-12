import gql from 'graphql-tag'

export default gql`
  mutation CreatePackageMutation($repoUrl: String!, $createdBy: String!) {
    createPackage(repoUrl: $repoUrl, createdBy: $createdBy) {
      id,
      name
    }
  }
`