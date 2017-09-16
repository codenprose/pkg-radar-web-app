import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
// import injectTapEventPlugin from 'react-tap-event-plugin
import registerServiceWorker from './utils/registerServiceWorker'

import { App } from './components/App'
// import { ScrollToTop } from './components/Shared'

import './index.css'

// Needed for onTouchTap mobile event
// http://stackoverflow.com/a/34015469/988941
// injectTapEventPlugin()

const networkInterface = createNetworkInterface({
  // uri: process.env.GRAPHQL_ENDPOINT,
  uri: 'http://localhost:8000/graphql'
})

networkInterface.use([{
  applyMiddleware (req, next) {
    if (!req.options.headers) {
      req.options.headers = {}
    }

    const token = localStorage.getItem('pkgRadarToken')
    if (token) {
      req.options.headers.authorization = `Bearer ${token}`
    }
    next()
  },
}])

export const client = new ApolloClient({
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