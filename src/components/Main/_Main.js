import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'

import { PackageDetail, PackageIndex, PackageUpdate } from '../Packages'
import { UserProfile, UserSettings } from '../Users'

class Main extends Component {
  render() {
    const { user } = this.props

    return (
      <main>
        <Switch>
          <Route exact path="/" render={(props) => <PackageIndex {...props} />} />
          <Route exact path="/:owner/:package" render={(props) => <PackageDetail {...props} />} />
          <Route exact path="/package/update/:owner/:package" render={(props) => <PackageUpdate {...props} />} />
          <Route exact path="/profile/:username" render={(props) => <UserProfile {...props} user={user} />} />
          <Route exact path="/settings" render={(props) => <UserSettings {...props} user={user} />} />
        </Switch>
      </main>
    )
  }
}

export default Main