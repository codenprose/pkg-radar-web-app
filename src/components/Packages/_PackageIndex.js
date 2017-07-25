import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import Grid from "material-ui/Grid";
// import ViewModuleIcon from 'material-ui-icons/ViewModule';
// import ViewListIcon from 'material-ui-icons/ViewList';

// import PackageIndexCategories from './_PackageIndexCategories'
import PackageIndexTable from './_PackageIndexTable'
import PackageCard from './_PackageCard'
import AllPackagesQuery from '../../queries/fetchAllPackages'

import javascript from "../../images/javascript.svg"
import python from "../../images/python.svg"
import java from "../../images/java.svg"
import go from "../../images/go.svg"
import swift from "../../images/swift.svg"
import c from "../../images/c.svg"
import cPlusPlus from "../../images/cPlusPlus.svg"
import cSharp from "../../images/cSharp.svg"
import php from "../../images/php.svg"
import ruby from "../../images/ruby.svg"


class PackageIndex extends Component {
  state = {
    view: "cards"
  };

  _renderPackageLayout = () => {
    const { view } = this.state;
    const { allPackages } = this.props.data;

    if (view === "table") {
      return <PackageIndexTable packages={allPackages} />;
    } else {
      return allPackages.map(pkg => {
        return (
          <Grid key={pkg.id} item xs={12} md={4} lg={3}>
            <PackageCard pkg={pkg} />
          </Grid>
        );
      });
    }
  };

  _renderCategory = (data, imgSrc) => {
    return (
      <div>
        <Grid container direction="row">
          <Grid item>
            <img src={imgSrc} alt="logo" />
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
      <div>
        {/* <div style={{ marginBottom: '30px' }}>
          <h3 className='ma0'>Top Packages</h3>
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
        </div> */}
        <Grid container direction="row">
          <Grid item xs={12} style={styles.category}>
            {this._renderCategory(data.allPackages, javascript)}
          </Grid>
          <Grid item xs={12} style={styles.category}>
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
          </Grid>
        </Grid>
      </div>
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