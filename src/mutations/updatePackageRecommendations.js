import gql from 'graphql-tag'


export default gql`
  mutation updatePackageRecommendations($id: ID!, $recommendations: [Json!] ) {
    updatePackage(id: $id, recommendations: $recommendations) {
      recommendations
    }
  } 
`