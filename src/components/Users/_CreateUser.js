import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import PropTypes from 'prop-types'

import createUser from '../../mutations/createUser'
import userQuery from '../../queries/user'


class CreateUser extends Component {

  static propTypes = {
    createUser: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
  }

  componentDidMount() {
    console.log('create user mounted')
    // redirect if user is logged in
    if (this.props.data.user) {
      console.warn('not a new user or already logged in')
      this.props.history.replace('/')
    } else {
      this.createUser()
    }
  }

  render () {
    return (
      <div className='w-100 pa4 flex justify-center'>
        <div style={{ maxWidth: 400 }} className=''>
          Loading...
        </div>
      </div>
    )
  }

  createUser = () => {
    console.log('create user')
    const profile = JSON.parse(window.localStorage.getItem('pkgRadarProfile'))

    const variables = {
      idToken: window.localStorage.getItem('auth0IdToken'),
      name: profile.name,
      username: profile.nickname,
      email: profile.email,
      avatar: profile.picture,
      github: profile
    }

    this.props.createUser({ variables })
      .then((response) => {
        console.log('create user response', response)
        // route user to profile
        // const id = response.data.createUser.id
        this.props.history.replace('/')
      }).catch((e) => {
        console.error(e)
        this.props.history.replace('/')
      })
  }
}

export default graphql(createUser, {name: 'createUser'})(
  graphql(userQuery, { options: {fetchPolicy: 'network-only'}})(CreateUser)
)