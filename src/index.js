import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import injectTapEventPlugin from 'react-tap-event-plugin'
import registerServiceWorker from './utils/registerServiceWorker'

import { App } from './components/App'
import './index.css'

// Needed for onTouchTap mobile event
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()

const networkInterface = createNetworkInterface({
  uri: process.env.GRAPHQL_ENDPOINT,
})

networkInterface.use([{
  applyMiddleware (req, next) {
    if (!req.options.headers) {
      req.options.headers = {}
    }

    // get the authentication token from local storage if it exists
    if (localStorage.getItem('graphcoolToken')) {
      req.options.headers.authorization = `Bearer ${localStorage.getItem('graphcoolToken')}`
    }
    next()
  },
}])

const client = new ApolloClient({
  networkInterface,
  dataIdFromObject: obj => obj.id
})

ReactDOM.render((
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>
), document.getElementById('root'))


registerServiceWorker()