import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { MuiThemeProvider } from 'material-ui/styles'
import PropTypes from 'prop-types'
import Auth0Lock from 'auth0-lock'
import { withRouter } from 'react-router-dom'

import { Header } from '../Header'
import { Main } from '../Main'
import Loader from './_Loader'

import createUserMutation from '../../mutations/createUser'
import userQuery from '../../queries/user'


class App extends Component {

  static propTypes = {
    data: PropTypes.object.isRequired
  }

  state = {
    isLoading: false
  }

  constructor (props) {
    super(props)

    this.auth = new Auth0Lock('3EcDQT2bQj5591sVy1UZ9Ahc4CEirOuT', 'dkh215.auth0.com')
  }

  componentWillMount() {
    this.auth.on('authenticated', (authResult) => {
      console.log('authenticated')
      this.setState({ isLoading: true })

      window.localStorage.setItem('accessToken', authResult.accessToken)
      window.localStorage.setItem('auth0IdToken', authResult.idToken)

      this.auth.getUserInfo(authResult.accessToken, (error, profile) => {
        if (error) {
          // Handle error
          console.error(error)
          return;
        }

        console.log(profile)
        this.createUser(authResult.idToken, profile)
      })
    })
  }

  createUser = (idToken, profile) => {
    console.log('create user')

    const variables = {
      idToken: idToken,
      name: profile.name,
      username: profile.nickname,
      email: profile.email,
      avatar: profile.picture,
      github: profile
    }

    this.props.createUser({ variables })
      .then((response) => {
        console.log('create user response', response)
        this.setState({ isLoading: false })
        // route user to profile
        const id = response.data.createUser.id
        this.props.history.replace(`/profile/${id}`)
      }).catch((e) => {
        console.error(e.message)
        this.setState({ isLoading: false })

        // replace with refecthQueries property in mutation options object
        if (e.message.includes('User already exists')) {
          this.props.data.refetch()
        }
      })
  }

  render() {
    const { data } = this.props
    if (data.loading || this.state.isLoading) return <Loader />

    return (
      <MuiThemeProvider>
        <div>
          <Header user={data.user} auth={this.auth} />
          <Main user={data.user} auth={this.auth} />
        </div>
      </MuiThemeProvider>
    )
  }
}


export default graphql(createUserMutation, {name: 'createUser'} )(
  graphql(userQuery, { options: {fetchPolicy: 'network-only'}})(withRouter(App))
)