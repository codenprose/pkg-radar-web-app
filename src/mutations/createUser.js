import gql from 'graphql-tag'


export default gql`
   mutation ($idToken: String!, $name: String!, $username: String!, $email: String!, $avatar: String!, $github: Json!){
    createUser(
      authProvider: {auth0: {idToken: $idToken}}, 
      name: $name, 
      username: $username,
      email: $email, 
      avatar: $avatar,
      github: $github
    ) {
        id
        name
      }
  }
`