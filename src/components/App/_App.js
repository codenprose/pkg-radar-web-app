import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import PropTypes from 'prop-types'

import Auth from '../../utils/auth'
import { Header } from '../Header'
import { Main } from '../Main'

import userQuery from '../../queries/user'


const auth = new Auth()

class App extends Component {

  static propTypes = {
    data: PropTypes.object.isRequired
  }

  render() {
    const { data } = this.props
    if (data.loading) return <div></div> 

    return (
      <MuiThemeProvider>
        <div>
          <Header auth={auth} user={data.user} />
          <Main auth={auth} user={data.user} />
        </div>
      </MuiThemeProvider>
    )
  }

}

export default graphql(userQuery, { options: {fetchPolicy: 'network-only'}})(App)