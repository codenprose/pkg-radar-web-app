import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import { Main } from '../Main'
import { Header } from '../Header'

const App = (props) => {
  return (
    <MuiThemeProvider>
      <div>
        <Header />
        <Main />
      </div>
    </MuiThemeProvider>
  )
}

export default App