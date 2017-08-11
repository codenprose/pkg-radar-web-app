import React, { Component } from 'react'
import Grid from "material-ui/Grid"
import Paper from 'material-ui/Paper'
import { Search } from '../Header'

class PackageIndex extends Component {
  render() {
    const title = '<pkg> radar'
    return (
      <Grid 
        container
        align="center"
        justify="center"
        direction="row"
      >
        <Grid item xs={6}>
          <h2 style={{ textAlign: 'center', fontSize: '50px' }}>{title}</h2>
          <Paper elevation={4} style={{ padding: '10px' }}>
            <Search />
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default PackageIndex