import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

import { PackageDetail, Top } from '../Packages'
import { UserConnections, UserProfile, UserSettings } from '../Users'
import { Home } from '../Home'
import { SearchResults } from '../SearchResults'
import { Languages } from '../Languages'
import { Discovery } from '../Discovery'
import { About } from '../About'

import { Packages } from '../Admin'
import { Login, PrivateRoute } from '../Auth'

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
          <Route exact path="/search" component={SearchResults} />
          <Route exact path="/about" component={About} />
          <Route exact path="/top" component={Top} />
          <Route exact path="/languages" component={Languages} />
          <Route exact path="/discovery" component={Discovery} />
          <PrivateRoute exact path="/admin/packages" component={Packages} />
          <Route exact path="/:owner/:package" render={
              (props) => <PackageDetail currentUser={user} isUserLoading={isUserLoading} {...props} />
            }
          />
          <Route exact path="/login" component={Login} />
        </Switch>
      </main>
    )
  }
}

export default Main
