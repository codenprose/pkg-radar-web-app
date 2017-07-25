import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import Grid from "material-ui/Grid";

import FETCH_PACKAGE from '../../queries/fetchPackage';
import FETCH_TAGS from "../../queries/fetchTags";
import ADD_TAG from "../../mutations/addTagToPackage";
import REMOVE_TAG from "../../mutations/removeTagFromPackage";

class PackageUpdate extends Component {
  state = {
    tags: []
  };

  _handleDelete = i => {
    let tags = this.state.tags;
    tags.splice(i, 1);
    this.setState({ tags: tags });
  };

  _handleAddition = tag => {
    let tags = this.state.tags;
    tags.push({
      id: tags.length + 1,
      text: tag
    });
    this.setState({ tags: tags });
  };

  _handleDrag = (tag, currPos, newPos) => {
    let tags = this.state.tags;

    // mutate array
    tags.splice(currPos, 1);
    tags.splice(newPos, 0, tag);

    // re-render
    this.setState({ tags: tags });
  };

  render() {
    console.log(this.props);

    return (
      <Grid 
        container 
        direction="row" 
        align="center" 
        justify="center"
      >
        <Grid item xs>
          <h2>Update Package</h2>
        </Grid>
      </Grid>
    )
  }
}

const fetchPackageOptions = {
  name: "package",
  options: (props) => { return { 
    variables: { name: props.match.params.name } } 
  }
}

export default compose(
  graphql(FETCH_PACKAGE, fetchPackageOptions),
  graphql(FETCH_TAGS, { name: "tags" }),
  graphql(ADD_TAG, { name: "addTag" }),
  graphql(REMOVE_TAG, { name: "removeTag" }),
)(PackageUpdate);
