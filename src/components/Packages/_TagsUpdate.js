import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import { WithContext as ReactTags } from "react-tag-input";
import find from "lodash/find";

import ADD_TAG from "../../mutations/addTagToPackage";
import REMOVE_TAG from "../../mutations/removeTagFromPackage";

class TagsUpdate extends Component {
  state = {
    tags: this.props.pkgTags,
  };

  _handleDelete = async (i) => {
    try {
      const tagId = this.state.tags[i].id
      const packageId = this.props.pkgId

      await this.props.removeTagFromPackage({
        variables: { tagId, packageId }
      });

      let tags = this.state.tags;
      tags.splice(i, 1);
      this.setState({ tags: tags });

    } catch (e) {
      console.error(e.message);
    }
  };

  _handleCreate = async (tagText) => {
    const { allTags } = this.props
    const packageId = this.props.pkgId

    const tag = find(allTags, { text: tagText })
    const tagId = tag.id
    
    try {
      await this.props.addTagToPackage({
        variables: { tagId, packageId }
      })
      this.setState({ tags: [...this.state.tags, tag] });
    } catch (e) {
      console.error(e.message)
    }
  }

  _handleDrag = (tag, currPos, newPos) => {
    let tags = this.state.tags;

    // mutate array
    tags.splice(currPos, 1);
    tags.splice(newPos, 0, tag);

    let tagsIds = []
    for (let index in tags) {
      tagsIds.push(tags[index].id)
    }
    // re-render
    this.setState({ tags: tags });
  };

  _formatSuggestions = () => {
    const tags = this.props.allTags
    const suggestions = []

    for (let index in tags) {
      const tag = tags[index]
      suggestions.push(tag.text)
    }
    return suggestions
  }

  render() {
    const suggestions = this._formatSuggestions()

    return (
      <div>
        <ReactTags
          autoFocus
          autocomplete
          tags={this.state.tags}
          suggestions={suggestions}
          handleDelete={this._handleDelete}
          handleAddition={this._handleCreate}
        />
      </div>
    );
  }
}

export default compose(
  graphql(ADD_TAG, { name: "addTagToPackage" }),
  graphql(REMOVE_TAG, { name: "removeTagFromPackage" }),
)(TagsUpdate);