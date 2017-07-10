import React, { Component } from 'react'
import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import algoliasearch from 'algoliasearch'

const client = algoliasearch("P8B4X1W4VV", "881ba02c36abee3f34e20a790bfd81f2")
const index = client.initIndex('Packages')


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
    if (pkg) this.props.history.push(`/package/${pkg.name}`)
  }

  render() {
    return (
      <div>
        <AsyncTypeahead
          autoFocus
          labelKey="name"
          onSearch={this._handleSearch}
          onChange={(selected) => this._handleSelection(selected)}
          placeholder="Search for Packages by Name or Tag..."
          renderMenuItemChildren={this._renderMenuItemChildren}
          options={this.state.options}
          filterBy={(option, text) => {
            const tags = option.tags.map( ({ name }) => name)
            return ['name', ...tags]
          }}
        />
      </div>
    )
  }
}

export default Search