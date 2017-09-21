import React, { Component } from 'react'

import Grid from "material-ui/Grid"
import Paper from 'material-ui/Paper'
// import Typography from 'material-ui/Typography';
// import Divider from 'material-ui/Divider';

// import { PackageCard } from '../Packages'
import { SearchMain } from '../Shared'
// import { Footer } from '../Footer'

class Home extends Component {
  static defaultProps = {
    title: '<pkg> radar'
  }

  render() {
    const { title } = this.props

    return (
      <Grid
        container
        align="center"
        justify="center"
        direction="row"
        id='Home'
        style={{ height: '80%' }}
      >
        <Grid item xs={6} style={{ maxWidth: '585px', marginBottom: '80px' }}>
          <h2 
            style={{ 
              textAlign: 'center', 
              fontSize: '60px', 
              color: '#263238',
              marginBottom: '20px',
              marginTop: 0
            }}
          >
            {title}
          </h2>
          <Paper elevation={4} style={{ padding: '10px 0' }}>
            <SearchMain />
          </Paper>
          <p 
            style={{ 
              position: 'relative',
              zIndex: -2,
              textAlign: 'center', 
              fontWeight: '300'
            }}
          >
            Search and Discover. Evaluate and Save.
          </p>
        </Grid>
        {/* <Grid item xs={12}>
          <Grid container>
            <Grid item xs={3}>
              <PackageCard
                avatar='https://avatars0.githubusercontent.com/u/69631'
                color='#f1e05a'
                issues={4601}
                language='JavaScript'
                ownerName='facebook'
                packageName='react'
                stars={70546}
              />
            </Grid>
            <Grid item xs={3}>
              <PackageCard
                avatar='https://avatars2.githubusercontent.com/u/27804?v=4'
                color='#3572A5'
                issues={0}
                language='Python'
                ownerName='django'
                packageName='django'
                stars={27287}
              />
            </Grid>
            <Grid item xs={3}>
              <PackageCard
                avatar='https://avatars3.githubusercontent.com/u/710255'
                color='#3572A5'
                issues={5439}
                language='Python'
                ownerName='fchollet'
                packageName='keras'
                stars={18339}
              />
            </Grid>
            <Grid item xs={3}>
              <PackageCard
                avatar='https://avatars1.githubusercontent.com/u/13409222'
                color='#f1e05a'
                issues={6786}
                language='JavaScript'
                ownerName='electron'
                packageName='electron'
                stars={48834}
              />
            </Grid>
          </Grid>
        </Grid> */}
      </Grid>
    );
  }
}

export default Home
