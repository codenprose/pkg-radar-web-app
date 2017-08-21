import React, { Component } from 'react'
import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import elasticsearch from 'elasticsearch'

const client = new elasticsearch.Client({
  host: 'https://search-pkg-radar-dev-packages-bfnemqricttw7m2gal2aecwqze.us-east-1.es.amazonaws.com'
});

class Search extends Component {
  state = {
    options: []
  }

  _renderMenuItemChildren(option, props, index) {
    return (
      <div key={option._id}>
        <img
          src={option._source.owner_avatar}
          style={{
            height: '30px',
            marginRight: '10px',
            width: '30px',
            verticalAlign: 'middle'
          }}
          alt="search-result"
        />
        <span>
          {option._source.owner_name}/{option._source.package_name}
          </span>
      </div>
    );
  }

  _handleSearch = (query) => {
    if (!query) return

    client.search({
      index: 'packages',
      type: 'package-details',
      body: {
        query: {
          query_string: {
            query: `${query}*`
          },
        }
      }
    }).then(body => {
      const hits = body.hits.hits

      if (hits.length) {
        this.setState({ options: hits })
      } else {
        this.setState({ options: [] })
      }
    }, error => {
      console.trace(error.message);
    })
  }

  _handleSelection = (selection) => {
    const pkg = selection[0]
    this.props._handlePackageSelection(pkg)
  }

  render() {
    return (
      <div>
        <AsyncTypeahead
          autoFocus
          disabled={!this.props.selectedBoard || !this.props.selectedStatus}
          labelKey={option => option._source.package_name}
          onSearch={this._handleSearch}
          onChange={selected => this._handleSelection(selected)}
          placeholder="Search for Packages"
          renderMenuItemChildren={this._renderMenuItemChildren}
          options={this.state.options}
        />
      </div>
    )
  }
}

export default Search