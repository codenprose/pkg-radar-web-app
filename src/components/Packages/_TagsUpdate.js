import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import { WithContext as ReactTags } from "react-tag-input";

import Button from 'material-ui/Button'

import ADD_TAG from "../../mutations/addTagToPackage";
import REMOVE_TAG from "../../mutations/removeTagFromPackage";

class TagsUpdate extends Component {
  state = {
    tags: this.props.pkgTags
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
    return (
      <div>
        <h3 className="mt0">Tags</h3>
        <ReactTags
          autoFocus
          tags={this.state.tags}
          suggestions={['hello']}
          handleDelete={this._handleDelete}
          handleAddition={this._handleAddition}
          handleDrag={this._handleDrag}
        />
        <div style={{ marginTop: "20px" }} className="tc">
          <Button raised>Save</Button>
        </div>
      </div>
    );
  }
}

export default compose(
  graphql(ADD_TAG, { name: "addTag" }),
  graphql(REMOVE_TAG, { name: "removeTag" }),
)(TagsUpdate);