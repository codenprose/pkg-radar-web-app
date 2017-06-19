import React from 'react'
import { Switch, Route } from 'react-router-dom'

import { PackageDetail } from '../Packages'
import { UserProfile, UserSettings } from '../Users'


const Main = () => (
  <main 
    className="pa3" 
    style={{ maxWidth: '1600px', margin: '0 auto' }}
  >
    <Switch>
      <Route exact path="/" component={PackageIndex} />
      <Route exact path="/package/:name" component={PackageDetail} />
      <Route exact path="/profile/:id" component={UserProfile} />
      <Route exact path="/profile/:id/settings" component={UserSettings} />
    </Switch>
  </main>
)

export default Main