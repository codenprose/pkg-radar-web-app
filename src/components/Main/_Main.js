import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

import { PackageDetail, PackageIndex } from '../Packages'
import { UserProfile, UserSettings } from '../Users'
import { Authenticate } from '../Auth'


class Main extends Component {

  handleAuthentication = (nextState, replace) => {
    if (/access_token|id_token|error/.test(nextState.location.hash)) {
      this.props.auth.handleAuthentication()
    }
  }

  render() {
    const { auth } = this.props
    
    return (
      <main 
        className="pa3" 
        style={{ maxWidth: '1600px', margin: '0 auto' }}
      >
        <Switch>
          <Route exact path="/" render={(props) => <PackageIndex auth={auth} {...props} />} />
          <Route exact path="/package/:name" render={(props) => <PackageDetail auth={auth} {...props} />} />
          <Route exact path="/profile/:id" render={(props) => <UserProfile auth={auth} {...props} />} />
          <Route exact path="/profile/:id/settings" render={(props) => <UserSettings auth={auth} {...props} />} />
          <Route path="/authenticate" render={(props) => {
              this.handleAuthentication(props)
              return <Authenticate {...props} auth={auth} /> 
            }}
          />
        </Switch>
      </main>
    )
  }
}


export default Main