import React, { Component } from 'react'
import Grid from "material-ui/Grid"
import Paper from 'material-ui/Paper'
import { Search } from '../Header'

class PackageIndex extends Component {
  render() {
    const title = '<pkg> radar'
    // const styles = {
    //   logo: {
    //     display: 'block',
    //     height: '125px',
    //     margin: '20px auto'
    //   }
    // }
    // const logo = 'http://www.underconsideration.com/brandnew/archives/google_2015_logo_detail.png'

    return (
      <Grid 
        container
        align="center"
        justify="center"
        direction="row"
      >
        <Grid item xs={6} style={{ maxWidth: '585px' }}>
          {/* <img style={styles.logo} src={logo} /> */}
          <h2 style={{ textAlign: 'center', fontSize: '60px', color: '#263238', marginTop: '100px' }}>{title}</h2>
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

export default PackageIndex