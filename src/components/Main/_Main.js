import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

import { PackageDetail, PackageUpdate } from '../Packages'
import { UserConnections, UserProfile, UserSettings } from '../Users'
import { Home } from '../Home'

class Main extends Component {
  render() {
    const { user, isUserLoading } = this.props

    return (
      <main>
        <Switch>
          <Route exact path="/" render={(props) => <Home {...props} />} />
          <Route exact path="/@:username" render={(props) => <UserProfile {...props} currentUser={user} />} />
          <Route exact path="/@:username/connections" render={
              (props) => <UserConnections {...props} currentUser={user} />
            } 
          />
          <Route exact path="/@:username/settings" render={(props) => <UserSettings {...props} user={user} />} />
          <Route exact path="/:owner/:package" render={
              (props) => <PackageDetail currentUser={user} isUserLoading={isUserLoading} {...props} />
            } 
          />
          <Route exact path="/:owner/:package/update" render={(props) => <PackageUpdate {...props} />} />
        </Switch>
      </main>
    )
  }
}

export default Main
