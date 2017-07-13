import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import { MuiThemeProvider, createMuiTheme  } from 'material-ui/styles'
import PropTypes from 'prop-types'
import Auth0Lock from 'auth0-lock'
import { withRouter } from 'react-router-dom'
import createPalette from 'material-ui/styles/palette'
import { blueGrey } from 'material-ui/styles/colors'

import { Header } from '../Header'
import { Main } from '../Main'
import Loader from './_Loader'

import CreateUserMutation from '../../mutations/createUser'
import SignInMutation from '../../mutations/signInUser'
import UserQuery from '../../queries/user'

const theme = createMuiTheme({
  palette: createPalette({
    primary: blueGrey,
  }),
  overrides: {
    MuiAppBar: {
      colorDefault: {
        backgroundColor: 'white'
      },
      colorPrimary: {
        backgroundColor: blueGrey[900]
      },
    },
    MuiButton: {
      raised: {
        backgroundColor: 'white'
      },
      raisedPrimary: {
        backgroundColor: blueGrey[900]
      }
    }
  },
});


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

      const accessToken = window.localStorage.getItem('accessToken');
      if (accessToken) {
        window.localStorage.setItem('auth0IdToken', authResult.idToken)
        this._siginInUser(authResult.idToken)
      } else {
        window.localStorage.setItem('accessToken', authResult.accessToken)
        window.localStorage.setItem('auth0IdToken', authResult.idToken)

        this.auth.getUserInfo(authResult.accessToken, (error, profile) => {
          if (error) {
            // Handle error
            console.error(error)
            return;
          }

          console.log(profile)
          this._createUser(authResult.idToken, profile)
        })
      }

    })
  }

  _siginInUser = async (idToken) => {
    try {
      await this.props.signinUser({
        variables: { idToken },
        update: (store, { data: { signinUser } }) => {
          let data = {}
          data.user = signinUser.user
          // Triggers component re-render
          store.writeQuery({ 
            query: UserQuery,
            data
          })
        }
      });
      this.setState({ isLoading: false })
    } catch (e) {
      console.error(e);
    }
  }

  _createUser = (idToken, profile) => {
    console.log('create user')

    this.props.createUser({ 
      variables: {
        idToken: idToken,
        name: profile.name,
        username: profile.nickname,
        email: profile.email,
        avatar: profile.picture,
        github: profile
      }
    })
    .then((response) => {
      console.log('create user response', response)
      this.setState({ isLoading: false })

      // route user to profile
      const username = response.data.createUser.username
      this.props.history.replace(`/profile/${username}`)
    }).catch((e) => {
      console.error(e.message)

      // replace with refecthQueries property in mutation options object
      if (e.message.includes('User already exists')) {
        this.props.data.refetch()
      }

      this.setState({ isLoading: false })
    })
  }

  render() {
    const { data } = this.props
    if (data.loading || this.state.isLoading) return <Loader />

    return (
      <MuiThemeProvider theme={theme}>
        <div>
          <Header user={data.user} auth={this.auth} />
          <Main user={data.user} auth={this.auth} />
        </div>
      </MuiThemeProvider>
    )
  }
}

export default compose(
  graphql(UserQuery, { options: {fetchPolicy: 'network-only'}}),
  graphql(CreateUserMutation, {name: 'createUser'} ),
  graphql(SignInMutation, {name: 'signinUser'} )
)(withRouter(App))