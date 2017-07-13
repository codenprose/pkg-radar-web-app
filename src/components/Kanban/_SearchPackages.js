import React, { Component } from 'react'
import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import algoliasearch from 'algoliasearch'

const client = algoliasearch("P8B4X1W4VV", "881ba02c36abee3f34e20a790bfd81f2")
const index = client.initIndex('PackagesByName')


class Search extends Component {
  state = {
    options: []
  }

  _renderMenuItemChildren(option, props, index) {
    return (
      <div key={option.id}>
        <img
          src={option.avatar}
          style={{
            height: '30px',
            marginRight: '10px',
            width: '30px',
            verticalAlign: 'middle'
          }}
          alt="search-result"
        />
        <span>{option.name}</span>
      </div>
    );
  }

  _handleSearch = (query) => {
    if (!query) return

    index.search(query, (err, content) => {
      this.setState({ options: content.hits })
    })
  }

  _handleSelection = (selection) => {
    const pkg = selection[0]
    this.props._handlePackageSelect(pkg)
  }

  render() {
    return (
      <div id="SearchPackages">
        <AsyncTypeahead
          disabled={!this.props.packageStatus}
          labelKey="name"
          onSearch={this._handleSearch}
          onChange={(selected) => this._handleSelection(selected)}
          placeholder={`Search by Package Name e.g. react, apollo client`}
          renderMenuItemChildren={this._renderMenuItemChildren}
          options={this.state.options}
          style={{ borderBottom: '2px solid #263238'}}
        />
      </div>
    )
  }
}

export default Search