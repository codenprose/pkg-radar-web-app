import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import registerServiceWorker from './utils/registerServiceWorker'

import { App } from './components/App'

import './index.css'

const networkInterface = createNetworkInterface({
  uri: process.env.GRAPHQL_ENDPOINT,
})

networkInterface.use([{
  applyMiddleware (req, next) {
    if (!req.options.headers) {
      req.options.headers = {}
    }

    const token = localStorage.getItem('pkgRadarToken')
    if (token) {
      req.options.headers.authorization = `bearer ${token}`
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
