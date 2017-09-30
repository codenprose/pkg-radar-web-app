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
import 'sweetalert2/dist/sweetalert2.css'

const networkInterface = createNetworkInterface({
  uri: process.env.GRAPHQL_ENDPOINT
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

window.addEventListener('load', () => {
  // Intercom
  window.Intercom("boot", {
    app_id: "f0v81ck6"
  });

  // Google Analytics
  import('./lib/autotrack.custom.js')
    .then(() => {
      const { ga } = window;

      ga('gtm1.require', 'eventTracker');
      ga('gtm1.require', 'urlChangeTracker');
      ga('gtm1.require', 'cleanUrlTracker');
      ga('gtm1.require', 'outboundLinkTracker');
      ga('gtm1.require', 'impressionTracker');
      ga('gtm1.require', 'pageVisibilityTracker');
      ga('gtm1.require', 'maxScrollTracker');
    })
})

registerServiceWorker()
