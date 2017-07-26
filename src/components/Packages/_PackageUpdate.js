import React, { Component } from "react";
import { graphql, compose } from "react-apollo";

import Grid from "material-ui/Grid";

import TagsUpdate from "./_TagsUpdate"

import FETCH_PACKAGE from '../../queries/fetchPackage';
import FETCH_TAGS from "../../queries/fetchTags";

class PackageUpdate extends Component {
  render() {
    const { pkg, tags } = this.props
    if (pkg.loading || tags.loading) return <div></div>

    return (
      <Grid 
        container 
        direction="column" 
        align="center"
        justify="center"
      >
        <Grid item>
          <h2 className="mt0">Update Package</h2>
          <h3 className="tc">{pkg.Package.name}</h3>
        </Grid>
        <Grid item>
          <TagsUpdate 
            pkgTags={pkg.Package.tags}
            allTags={tags.allTags}
          />
        </Grid>
      </Grid>
    )
  }
}

const fetchPackageOptions = {
  name: "pkg",
  options: (props) => { return { 
    variables: { name: props.match.params.name } } 
  }
}

export default compose(
  graphql(FETCH_TAGS, { name: "tags" }),
  graphql(FETCH_PACKAGE, fetchPackageOptions)
)(PackageUpdate);
