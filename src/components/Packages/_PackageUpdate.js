import React, { Component } from "react";
import { graphql, compose } from "react-apollo";

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "material-ui/Dialog";
import Button from "material-ui/Button";

import TagsUpdate from "./_TagsUpdate";

import GET_PACKAGE from "../../queries/package";
import FETCH_TAGS from "../../queries/fetchTags";

class PackageUpdate extends Component {
  state = {
    isModalOpen: this.props.isModalOpen
  };

  static defaultProps = {
    isModalOpen: true
  }

  render() {
    const { history, pkg, tags } = this.props;
    if (pkg.loading || tags.loading) return <div />;

    return (
      <Dialog 
        open={this.state.isModalOpen}
      >
        <DialogTitle>Update Package</DialogTitle>
        <DialogContent style={{ minWidth: '600px' }}>
          <DialogContentText style={{ marginBottom: '10px' }}>
            Tags
          </DialogContentText>
          <TagsUpdate 
            allTags={tags.allTags} 
            pkgTags={pkg.Package.tags}
            pkgId={pkg.Package.id}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            color="primary" 
            onClick={() => history.push(`/package/${pkg.Package.name}`)}
          >
            Exit
          </Button>
          <Button 
            color="primary" 
            onClick={() => history.push(`/package/${pkg.Package.name}`)}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const fetchPackageOptions = {
  name: "pkg",
  options: props => {
    return {
      variables: { 
        ownerName: props.match.params.owner,
        packageName: props.match.params.package
      }
    };
  }
};

export default compose(
  graphql(FETCH_TAGS, { name: "tags" }),
  graphql(GET_PACKAGE, fetchPackageOptions)
)(PackageUpdate);
