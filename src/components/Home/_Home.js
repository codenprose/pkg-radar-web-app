import React, { Component } from 'react'
import Grid from "material-ui/Grid"
import Paper from 'material-ui/Paper'

import { Search } from '../Header'

class Home extends Component {
  static defaultProps = {
    title: '<pkg> hunter'
  }

  render() {
    const { title } = this.props

    return (
      <Grid
        container
        align="center"
        justify="center"
        direction="row"
      >
        <Grid item xs={6} style={{ maxWidth: '585px' }}>
          <h2 style={{ textAlign: 'center', fontSize: '60px', color: '#263238' }}>{title}</h2>
          <Paper elevation={4} style={{ padding: '10px' }}>
            <Search />
          </Paper>
          <p style={{ textAlign: 'center', fontWeight: '300' }}>
            Search and Discover the best of Open Source Software
          </p>
        </Grid>
      </Grid>
    );
  }
}

export default Home
