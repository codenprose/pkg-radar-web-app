import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

import { PackageDetail } from '../Packages'
import { UserConnections, UserProfile, UserSettings } from '../Users'
import { Home } from '../Home'
import { SearchResults } from '../SearchResults'
import { Languages } from '../Languages'
import { Discovery } from '../Discovery'

class Main extends Component {
  render() {
    const { user, isUserLoading } = this.props

    return (
      <main>
        <Switch>
          <Route exact path="/" render={(props) => <Home {...props} />} />
          <Route exact path="/@:username" render={
            (props) => <UserProfile {...props} currentUser={user} isCurrentUserLoading={isUserLoading} />}
          />
          <Route exact path="/@:username/connections" render={
              (props) => <UserConnections {...props} currentUser={user} />
            }
          />
          <Route exact path="/@:username/settings" render={(props) => <UserSettings {...props} user={user} />} />
          <Route exact path="/:owner/:package" render={
              (props) => <PackageDetail currentUser={user} isUserLoading={isUserLoading} {...props} />
            }
          />
          <Route exact path="/search" component={SearchResults} />
          <Route exact path="/languages" component={Languages} />
          <Route exact path="/discovery" component={Discovery} />
        </Switch>
      </main>
    )
  }
}

export default Main
