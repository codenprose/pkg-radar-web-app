import React, { Component } from 'react'
import queryString from 'query-string'

import SearchResultsTable from './_SearchResultsTable'
import { Loader } from '../Shared'

class SearchResults extends Component {
  state = {
    isLoading: false,
    results: []
  }

  componentWillMount() {
    const query = this.props.location.search
    const params = queryString.parse(query)
    if (this.props.location.pathname.includes('top')) {
      this._handleSearch('*')  
    } else {
      this._handleSearch(params.q)
    }
  }

  componentWillReceiveProps(nextProps) {
    const query = nextProps.location.search
    const params = queryString.parse(query)
    if (nextProps.location.pathname.includes('top')) {
      this._handleSearch('*')  
    } else {
      this._handleSearch(params.q)
    }
  }

  _handleSearch = async (query) => {
    this.setState({ isLoading: true })

    query = query.toLowerCase();

    try {
      const endpoint = `${process.env.ELASTIC_SEARCH_ENDPOINT}/_search`;
      const body = {
        from : 0,
        size : 100,
        query: {
          query_string: {
            fields : ["package_name^2", "owner_name", "tags", "username", "name", "description", "language"],
            default_operator: 'AND',
            query: `${query}`
          },
        },
        sort: [
          {"stars" : {"order" : "desc", "unmapped_type" : "long"}}
       ]
      }

      const options = {
        method: 'POST',
        'Content-Type': 'application/json',
        body: JSON.stringify(body)
      }

      const response = await fetch(endpoint, options);
      const json = await response.json();

      const hits = json.hits.hits
      if (hits.length) {
        this.setState({ results: hits, isLoading: false })
      } else {
        this.setState({ results: [], isLoading: false })
      }
    } catch (e) {
      console.error(e);
      this.setState({ isLoading: false })
    }
  };

  render() {
    const { results } = this.state
    if (this.state.isLoading) return <Loader />
    if (!results.length) return <h2>No Results</h2>
    return <SearchResultsTable data={results} />
  }
}

export default SearchResults
