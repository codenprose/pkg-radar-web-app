import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Auth0Lock from 'auth0-lock'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import { withRouter } from 'react-router-dom'

class LoginAuth0 extends Component {

  constructor (props) {
    super(props)

    this._lock = new Auth0Lock('3EcDQT2bQj5591sVy1UZ9Ahc4CEirOuT', 'dkh215.auth0.com')
  }

  static propTypes = {
    history: PropTypes.object.isRequired,
  }

  componentWillMount() {
    const { history } = this.props

    this._lock.on('authenticated', (authResult) => {
      window.localStorage.setItem('accessToken', authResult.accessToken)
      window.localStorage.setItem('auth0IdToken', authResult.idToken)
      
      this._lock.getUserInfo(authResult.accessToken, (error, profile) => {
        if (error) {
          // Handle error
          console.error(error)
          return;
        }
        
        window.localStorage.setItem('pkgRadarProfile', JSON.stringify(profile))
        history.push(`/signup`)
      })
    })
  }

  _showLogin = () => {
    this._lock.show()
  }

  _logout = () => {
    // remove token from local storage and reload page to reset apollo client
    window.localStorage.removeItem('auth0IdToken')
    window.location.reload('/')
  }

  render() {
    const { user } = this.props

    return (
      <div>
        {
          !user &&
          <div>
            <FlatButton
              label="Log In"
              style={{ marginRight: '20px' }}
              onClick={() => this._showLogin()}
            />
            <RaisedButton
              primary={true}
              label="Sign Up"
              onClick={() => this._showLogin()}
            />
          </div>
        }
        {
          user &&
          <RaisedButton
            label="Log Out"
            style={{ marginRight: '20px' }}
            onClick={() => this._logout()}
          />
        }
      </div>
    )
  }
}

export default withRouter(LoginAuth0)