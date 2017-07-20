import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import Grid from "material-ui/Grid";
import ViewModuleIcon from 'material-ui-icons/ViewModule';
import ViewListIcon from 'material-ui-icons/ViewList';

import PackageIndexCategories from './_PackageIndexCategories'
import PackageIndexTable from './_PackageIndexTable'
import PackageCard from './_PackageCard'
import AllPackagesQuery from '../../queries/fetchAllPackages'


class PackageIndex extends Component {
  state = {
    view: 'cards'
  }

  _renderPackageLayout = () => {
    const { view } = this.state
    const { allPackages } = this.props.data

    if (view === "table") {
      return <PackageIndexTable packages={allPackages} />
    } else {
     return allPackages.map(pkg => {
       return (
         <Grid key={pkg.id} item xs={12} md={4} xl={3}>
           <PackageCard pkg={pkg} />
         </Grid>
       )
     });
    }
  }
  
  render() {
    const { data } = this.props;
    if (data.loading) return <div />

    return (
      <div>
        <h3 className='fl ma0'>Top Packages</h3>
        <div className='fr mb2'>
          <ViewModuleIcon 
            onClick={() => this.setState({ view: 'cards' })}
            style={{
              height: '32px',
              width: '32px',
              verticalAlign: 'top',
              cursor: 'pointer'
            }} 
          />
          <ViewListIcon 
            onClick={() => this.setState({ view: 'table' })}
            style={{
              height: '30px',
              width: '30px',
              cursor: 'pointer'
            }}
          />
        </div>
        <Grid
          container
          direction="row"
        >
          <Grid item xs={3}>
            <PackageIndexCategories />
          </Grid>
          <Grid item xs={9}>
            <Grid container>
              {this._renderPackageLayout()}
            </Grid>
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