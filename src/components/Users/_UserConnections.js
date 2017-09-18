import React, { Component } from 'react'
import { graphql, compose } from "react-apollo"
import { Link } from "react-router-dom"

import Button from "material-ui/Button"
import Grid from "material-ui/Grid"
import Paper from 'material-ui/Paper'
import Typography from 'material-ui/Typography'

import { Loader } from '../Shared'

import GET_USER_CONNECTIONS from '../../queries/userConnections'
  
class UserConnections extends Component {
  _renderConnections = () => {
    const { currentUser } = this.props
    const { userConnections } = this.props.data
    if (!userConnections.length) return 'No Connections'

    return userConnections.map(connection => {
      let btnDisabled = false
      let btnText = 'Connect'

      if (currentUser && connection.username === currentUser.username) {
        btnDisabled = true
        btnText = 'Connected'
      }

      return (
        <Grid item xs={3} key={connection.username}>
          <Paper 
            elevation={2}
            style={{ padding: '20px' }}
          >
            <Grid container direction="row" justify="center">
              <Grid item>
                <img 
                  height='80' 
                  src={connection.avatar}
                  alt='connection'
                  style={{ borderRadius: '50%' }}
                />
              </Grid>
              <Grid item xs={12}>
                <div className='tc'>
                  <Typography type="title" gutterBottom>
                    {connection.name}
                  </Typography>
                  <Typography type="subheading" gutterBottom>
                    {connection.bio}
                  </Typography>
                  <Typography type="body1" gutterBottom style={{ marginBottom: '20px' }}>
                    <Link
                      to={`/@${connection.username}`}
                      className='no-underline black'
                    >
                      @{connection.username}
                    </Link>
                  </Typography>
                  <Button 
                    raised
                    disabled={btnDisabled} 
                    color='primary'
                  >
                    {btnText}
                  </Button>
                </div>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      )
    })
  }

  render() {
    if (this.props.data.loading) return <Loader />
    // console.log('props', this.props)

    return (
      <div>
        <Grid container>
          {this._renderConnections()}
        </Grid>
      </div>
    )
  }
}

const userConnectionOptions = {
  options: props => {
    return {
      fetchPolicy: 'network-only',
      variables: { 
        username: props.match.params.username
      }
    };
  }
}

export default compose(
  graphql(GET_USER_CONNECTIONS, userConnectionOptions),
)(UserConnections)