import React, { Component } from 'react'
import queryString from 'query-string'
import elasticsearch from 'elasticsearch'

import SearchResultsTable from './_SearchResultsTable'
import { Loader } from '../Shared'

const client = new elasticsearch.Client({
  host: process.env.ELASTIC_SEARCH_ENDPOINT
});

class SearchResults extends Component {
  state = {
    isLoading: false,
    results: []
  }

  componentWillMount() {
    const query = this.props.location.search
    const params = queryString.parse(query)
    this._handleSearch(params.q)
  }

  componentWillReceiveProps(nextProps) {
    const query = nextProps.location.search
    const params = queryString.parse(query)
    this._handleSearch(params.q)
  }

  _handleSearch = (query) => {
    this.setState({ isLoading: true })

    query = query.toLowerCase();
    client.search({
      index: 'pkg-radar-dev',
      body: {
        query: {
          query_string: {
            fields : ["package_name^2", "owner_name", "tags.keyword", "username", "name"],
            default_operator: 'AND',
            query: `${query}`
          },
        },
        sort: [
          {"stars" : {"order" : "desc", "unmapped_type" : "long"}}
       ]
      }
    }).then(body => {
      const hits = body.hits.hits
      // console.log('hits', hits)
      if (hits.length) {
        this.setState({ results: hits, isLoading: false })
      } else {
        this.setState({ results: [], isLoading: false })
      }
    }, error => {
      this.setState({ isLoading: false })
      console.trace(error.message);
    })
  };

  render() {
    const { results } = this.state
    if (this.state.isLoading) return <Loader />
    if (!results.length) return <h2>No Results</h2>
    return <SearchResultsTable data={results} />
  }
}

export default SearchResults
