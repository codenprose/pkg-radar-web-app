import gql from 'graphql-tag'

export default gql`
  mutation createUser(
    $avatar: String!, 
    $bio: String!,
    $company: String!,
    $email: String!,
    $githubId: String!,
    $location: String!
    $name: String!, 
    $username: String!,
    $website: String!,
  ) {
    createUser(
      avatar: $avatar, 
      bio: $bio, 
      company: $company, 
      email: $email, 
      githubId: $githubId,
      location: $location
      name: $name, 
      username: $username, 
      website: $website,
    ) {
      user {
        avatar
        bio
        company
        id
        name
        totalPackages
        totalSubscriptions
        username
        website
      }
    } 
  }
`