import React, { Component } from 'react'
import { MuiThemeProvider, createMuiTheme  } from 'material-ui/styles'
// import PropTypes from 'prop-types'
import { graphql, compose } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import createPalette from 'material-ui/styles/palette'
import { blueGrey } from 'material-ui/styles/colors'

import { Header } from '../Header'
import { Main } from '../Main'
import { Loader } from '../Shared'

import GET_CURRENT_USER from '../../queries/currentUser'

const theme = createMuiTheme({
  palette: createPalette({
    primary: blueGrey,
  }),
  overrides: {
    MuiAppBar: {
      colorDefault: {
        backgroundColor: 'white'
      },
      colorPrimary: {
        backgroundColor: blueGrey[900]
      },
    },
    MuiButton: {
      raised: {
        backgroundColor: 'white'
      },
      raisedPrimary: {
        backgroundColor: blueGrey[900]
      }
    }
  },
});


class App extends Component {
  state = {
    isLoading: false
  };

  githubAuth = () => {
    const clientId = '1050d5bcb642ab0beb2e'
    window.location = `https://github.com/login/oauth/authorize?client_id=${clientId}`
  }

  render() {
    const { data } = this.props;
    if (data.loading) return <Loader />;

    return (
      <MuiThemeProvider theme={theme}>
        <div>
          <Header user={data.currentUser} githubAuth={this.githubAuth} />
          <Main user={data.currentUser} />
        </div>
      </MuiThemeProvider>
    );
  }
}

const getCurrentUserOptions = {
  skip: (props) => {
    const token = localStorage.getItem('pkgRadarToken')
    return token === 'undefined' || !token
  },
  options: (props) => {
    return {
      variables: { 
        username: localStorage.getItem('pkgRadarUsername'),
        token: localStorage.getItem('pkgRadarToken')
      }
    };
  }
};

export default compose(
  graphql(GET_CURRENT_USER, getCurrentUserOptions),
)(withRouter(App));