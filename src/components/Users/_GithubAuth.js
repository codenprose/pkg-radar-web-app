import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'

import { Loader } from '../Shared'

import CREATE_USER from '../../mutations/createUser'

class GithubAuth extends Component {
  componentWillMount() {
    // const token = localStorage.getItem('pkgRadarToken')
    // if (token) this.props.history.replace('/')

    const code = window.location.href.match(/\?code=(.*)/)[1];
    console.log('github code', code)

    const options = {
      method: 'POST',
      body: JSON.stringify({ code: code }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors'
    }

    fetch('https://jb0vjjdukd.execute-api.us-east-1.amazonaws.com/prod', options)
      .then(response => {
        return response.json()
      })
      .then(json => {
        console.log('github auth success')
        const { token, profile } = json.body

        // save profile data to dynamo via graphql mutation
        this._createUser(profile, token)
      })
      .catch(err => {
        console.log('github auth component error')
        console.error(err)
      })
  }

  _createUser = async (profile, token) => {
    console.log('authenticate user')

    try {
      await this.props.createUser({
        variables: {
          avatar: profile.avatar_url,
          bio: profile.bio ? profile.bio : '',
          company: profile.company ? profile.company : '',
          email: profile.email,
          githubId: profile.id,
          location: profile.location ? profile.location : '',
          name: profile.name,
          username: profile.login,
          website: profile.blog ? profile.blog : '',
        }
      })
      console.log('user authentication success')

      localStorage.setItem('pkgRadarToken', token)
      localStorage.setItem('pkgRadarUsername', profile.login)

      window.location.replace('/')
    } catch (e) {
      console.error(e.message)
    }
  }

  render() {
    return <Loader />
  }
}

export default compose(
  graphql(CREATE_USER, {name: 'createUser'} ),
)(GithubAuth)
