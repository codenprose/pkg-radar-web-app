import gql from 'graphql-tag'


export default gql`
  mutation createPackage($repoURL: String!) {
    createPackage(repoURL: $repoURL) {
      id,
      name
    }
  }
`