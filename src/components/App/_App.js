import React, { Component } from 'react'
import { MuiThemeProvider, createMuiTheme  } from 'material-ui/styles'
// import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import createPalette from 'material-ui/styles/palette'
import { blueGrey } from 'material-ui/styles/colors'
import AWS from 'aws-sdk'
import uuidv4 from 'uuid/v4'
import 'amazon-cognito-js'

import { Header } from '../Header'
import { Main } from '../Main'
// import Loader from './_Loader'

AWS.config.region = 'us-east-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:21e5d2d6-a954-4e4a-8f67-39725835621d',
});


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

  componentWillMount() {

  }

  googleAuth = response => {
    console.log(response);
    const idToken = response.tokenId;
    const profile = response.profileObj;

    AWS.config.credentials.params.Logins = {};
    AWS.config.credentials.params.Logins["accounts.google.com"] = idToken;

    AWS.config.credentials.get(() => {
      const client = new AWS.CognitoSyncManager()

      client.openOrCreateDataset("profile", (err, dataset) => {
        // Set id only if one doesn't exist
        profile.id = uuidv4()

        dataset.putAll(profile, (err, record) => {
          console.log("record", record);

          dataset.synchronize({
            onSuccess(data, newRecords) {
              // Set token and profile to localStorage 
              localStorage.setItem('pkgRadarIdToken', idToken)
              localStorage.setItem('pkgRadarProfile', JSON.stringify(profile))
              
              console.log('sync success')
              console.log('profile', profile)
            },
            onFailure(err) {
              console.error(err);
            }
          });
        });
      });
    });
  };

  render() {
    // const { data } = this.props;
    // if (data.loading || this.state.isLoading) return <Loader />;

    return (
      <MuiThemeProvider theme={theme}>
        <div>
          <Header user={''} googleAuth={this.googleAuth} />
          <Main user={''} />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(App)