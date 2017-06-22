import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

import { PackageDetail, PackageIndex } from '../Packages'
import { UserProfile, UserSettings } from '../Users'


class Main extends Component {
  render() {
    // const { auth } = this.props

    return (
      <main 
        className="pa3" 
        style={{ maxWidth: '1600px', margin: '0 auto' }}
      >
        <Switch>
          <Route exact path="/" render={(props) => <PackageIndex {...props} />} />
          <Route exact path="/package/:name" render={(props) => <PackageDetail {...props} />} />
          <Route exact path="/profile/:id" render={(props) => <UserProfile {...props} />} />
          <Route exact path="/profile/:id/settings" render={(props) => <UserSettings {...props} />} />
        </Switch>
      </main>
    )
  }
}


export default Main