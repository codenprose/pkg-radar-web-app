import React, { Component } from 'react'
import { graphql } from 'react-apollo'

// import createUser from '../../mutations/createUser'
import userQuery from '../../queries/user'


class Authenticate extends Component {
  componentWillReceiveProps(nextProps) {
    const { auth, data, history } = nextProps
    const accessToken = localStorage.getItem('access_token')

    // check if user is authenticated through auth0
    if (auth.isAuthenticated()) {
      if (!data.user) {
        // if user does not exist in graphcool db, create user then sign user in
        auth.auth0.client.userInfo(accessToken, (err, response) => {
          console.log(response)
        })
      } else if (data.user || accessToken === null) {
        // if not a new user or already logged in, redirect home
        console.warn('not a new user or already logged in')
        history.replace('/')
      }
    } else {
      // if user is not authenticated with auth0, redirect to login
      auth.login()
    }
  }

  render() {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    )
  }
}

export default graphql(userQuery, { options: {fetchPolicy: 'network-only'}})(Authenticate)