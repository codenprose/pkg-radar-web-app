import React, { Component } from 'react'
import Grid from 'material-ui/Grid'
import queryString from 'query-string'
import elasticsearch from 'elasticsearch'

import { PackageCard } from '../Packages'
import { Loader } from '../Shared'

const client = new elasticsearch.Client({
  host: 'https://search-pkg-radar-dev-mmb7kjm5g3r3erpsymjj7wcwvy.us-east-1.es.amazonaws.com'
});

class Search extends Component {
  state = {
    isLoading: false,
    results: []
  }

  componentWillMount() {
    const search = this.props.location.search
    const params = queryString.parse(search)
    
    this._handleSearch(params.q)
  }

  _handleSearch = (query) => {
    this.setState({ isLoading: true })

    query = query.toLowerCase();
    client.search({
      index: 'pkg-radar-dev',
      type: 'packages',
      body: {
        query: {
          query_string: {
            query: `${query}`
          },
        }
      }
    }).then(body => {
      const hits = body.hits.hits
      // console.log('hits', hits)
      if (hits.length) {
        this.setState({ results: hits, isLoading: false })
      } else {
        this.setState({ suggestions: [], isLoading: false })
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
    
    return (
      <div>
        <Grid container direction="row">
          {
            results.length &&
            results.map(item => {
              const pkg = item._source
              return (
                <Grid item xs={12} md={6} xl={4} key={item._id}>
                  <PackageCard 
                    avatar={pkg.owner_avatar}
                    color={pkg.color}
                    description={pkg.description}
                    issues={pkg.issues}
                    language={pkg.language}
                    ownerName={pkg.owner_name}
                    packageName={pkg.package_name}
                    stars={pkg.stars}
                  />
                </Grid>
              )
            })
          }
        </Grid>
      </div>
    )
  }
}

export default Search
