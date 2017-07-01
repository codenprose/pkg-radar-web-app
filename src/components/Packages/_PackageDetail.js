import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'

import fetchPackage from '../../queries/fetchPackage'


class PackageDetail extends Component {
  render() {
    const { data } = this.props
    if (data.loading) return <div></div>

    console.log(data)

    return (
      <div>
        <Grid container>
          <Grid item>
            <Typography
              type="title"
              color="inherit"
            >
              {data.Package.name}
            </Typography>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default graphql(fetchPackage, {
  options: (props) => { return { 
    variables: { name: props.match.params.name } } 
  }
})(PackageDetail)