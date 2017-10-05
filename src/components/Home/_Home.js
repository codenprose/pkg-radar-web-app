import React, { Component } from 'react'

import Grid from "material-ui/Grid"
import Paper from 'material-ui/Paper'
// import Typography from 'material-ui/Typography';
// import Divider from 'material-ui/Divider';

import { PackageCard } from '../Packages'
import { SearchMain } from '../Shared'
import { Footer } from '../Footer'

import reactImgSrc from '../../images/facebook.png';
import djangoImgSrc from '../../images/django.png';
import kerasImgSrc from '../../images/keras.png';
import electronImgSrc from '../../images/electron.png';

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
        style={{ height: '100%' }}
      >
        <Grid
          item
          xs={6}
          style={{ maxWidth: '585px', marginBottom: '10px' }}
        >
          <h2
            style={{
              textAlign: 'center',
              fontSize: '60px',
              color: '#263238',
              marginBottom: '20px',
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
            Find dependencies faster and organize your favorite open source projects.
          </p>
        </Grid>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={3}>
              <PackageCard
                avatar={reactImgSrc}
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
                avatar={djangoImgSrc}
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
                avatar={kerasImgSrc}
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
                avatar={electronImgSrc}
                color='#f1e05a'
                issues={6786}
                language='JavaScript'
                ownerName='electron'
                packageName='electron'
                stars={48834}
              />
            </Grid>
          </Grid>
        </Grid>
        <Footer />
      </Grid>
    );
  }
}

export default Home
