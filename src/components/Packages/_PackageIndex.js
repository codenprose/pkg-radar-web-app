import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import Grid from "material-ui/Grid";

import Tabs, { Tab } from 'material-ui/Tabs'

import PackageCard from './_PackageCard'
import AllPackagesQuery from '../../queries/fetchAllPackages'

import javascript from "../../images/javascript.svg"
// import python from "../../images/python.svg"
// import java from "../../images/java.svg"
// import go from "../../images/go.svg"
// import swift from "../../images/swift.svg"
// import c from "../../images/c.svg"
// import cPlusPlus from "../../images/cPlusPlus.svg"
// import cSharp from "../../images/cSharp.svg"
// import php from "../../images/php.svg"
// import ruby from "../../images/ruby.svg"


class PackageIndex extends Component {
  _renderCategory = (data, imgSrc) => {
    return (
      <div>
        <Grid container direction="row">
          <Grid item>
            <img 
              src={imgSrc} 
              alt="logo"
              style={{ marginRight: '20px' }}
            />
            <Tabs
              index={0}
              onChange={() => console.log('tab change')}
              indicatorColor="primary"
              textColor="primary"
              fullWidth
              style={{ display: 'inline-block' }}
            >
              <Tab label="Top" />
              <Tab label="Latest" />
            </Tabs>
          </Grid>
        </Grid>
        <Grid container direction="row">
          {
            data.map(pkg => {
              return (
                <Grid key={pkg.id} item xs={3}>
                  <PackageCard pkg={pkg} />
                </Grid>
              );
            })
          }
        </Grid>
      </div>
    );
  };

  render() {
    const { data } = this.props;
    if (data.loading) return <div />;

    const styles = {
      category: {
        marginBottom: '40px'
      }
    }

    return (
      <Grid container direction="row">
        <Grid item xs={12} style={styles.category}>
          {this._renderCategory(data.allPackages, javascript)}
        </Grid>
        {/* <Grid item xs={12} style={styles.category}>
          {this._renderCategory(data.allPackages, python)}
        </Grid>
        <Grid item xs={12} style={styles.category}>
          {this._renderCategory(data.allPackages, java)}
        </Grid>
        <Grid item xs={12} style={styles.category}>
          {this._renderCategory(data.allPackages, go)}
        </Grid>
        <Grid item xs={12} style={styles.category}>
          {this._renderCategory(data.allPackages, swift)}
        </Grid>
        <Grid item xs={12} style={styles.category}>
          {this._renderCategory(data.allPackages, c)}
        </Grid>
        <Grid item xs={12} style={styles.category}>
          {this._renderCategory(data.allPackages, cPlusPlus)}
        </Grid>
        <Grid item xs={12} style={styles.category}>
          {this._renderCategory(data.allPackages, cSharp)}
        </Grid>
        <Grid item xs={12} style={styles.category}>
          {this._renderCategory(data.allPackages, php)}
        </Grid>
        <Grid item xs={12} style={styles.category}>
          {this._renderCategory(data.allPackages, ruby)}
        </Grid> */}
      </Grid>
    );
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