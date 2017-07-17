import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import Grid from "material-ui/Grid";

import PackageIndexCategories from './_PackageIndexCategories'
import PackageIndexTable from './_PackageIndexTable'
import AllPackagesQuery from '../../queries/fetchAllPackages'


class PackageIndex extends Component {
  render() {
    const { data } = this.props;
    if (data.loading) return <div />

    return (
      <div>
        <Grid
          container
          direction="row"
        >
          <Grid item xs={3}>
            <PackageIndexCategories />
          </Grid>
          <Grid item xs={9}>
            <PackageIndexTable packages={data.allPackages} />
          </Grid>
        </Grid>
      </div>
    )
  }
}

const fetchAllPackagesOptions = {
  options: props => {
    return {
      variables: { first: 15, orderBy: "stars_DESC" }
    };
  }
};

export default compose(
  graphql(AllPackagesQuery, fetchAllPackagesOptions),
)(PackageIndex)