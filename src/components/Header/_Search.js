import React, { Component } from 'react'
import { AsyncTypeahead } from 'react-bootstrap-typeahead'
// import algoliasearch from 'algoliasearch'


class Search extends Component {
  state = {
    multiple: false,
    options: [],
  }

  _renderMenuItemChildren(option, props, index) {
    return (
      <div key={option.id}>
        <img
          src={option.avatar_url}
          style={{
            height: '30px',
            marginRight: '10px',
            width: '30px',
            verticalAlign: 'middle'
          }}
        />
        <span>{option.login}</span>
      </div>
    );
  }

  _handleChange(e) {
    const { checked, name } = e.target;
    this.setState({ [name]: checked });
  }

  _handleSearch = (query) => {
    if (!query) {
      return;
    }

    fetch(`https://api.github.com/search/users?q=${query}`)
      .then(resp => resp.json())
      .then(json => this.setState({ options: json.items }));
  }

  render() {
    return (
      <div>
        <AsyncTypeahead
          {...this.state}
          clearButton
          labelKey="login"
          onSearch={this._handleSearch}
          placeholder="Search for a Github user..."
          renderMenuItemChildren={this._renderMenuItemChildren}
        />
      </div>
    )
  }
}

export default Search