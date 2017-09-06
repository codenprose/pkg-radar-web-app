import React, { Component } from 'react'
import Grid from 'material-ui/Grid'
import queryString from 'query-string'
import elasticsearch from 'elasticsearch'

import { PackageCard } from '../Packages'

const client = new elasticsearch.Client({
  host: 'https://search-pkg-radar-dev-mmb7kjm5g3r3erpsymjj7wcwvy.us-east-1.es.amazonaws.com'
});

class Search extends Component {
  state = {
    results: []
  }

  componentWillMount() {
    const search = this.props.location.search
    const params = queryString.parse(search)
    
    this._handleSearch(params.q)
  }

  _handleSearch = (query) => {
    query = query.toLowerCase();
    client.search({
      index: 'pkg-radar-dev',
      body: {
        query: {
          query_string: {
            query: `${query}*`
          },
        }
      }
    }).then(body => {
      const hits = body.hits.hits
      // console.log('hits', hits)
      if (hits.length) {
        this.setState({ results: hits })
      } else {
        this.setState({ suggestions: [] })
      }
    }, error => {
      console.trace(error.message);
    })
  };

  render() {
    const { results } = this.state
    // console.log(results)
    
    return (
      <div>
        <Grid container direction="row">
          {
            results.length &&
            results.map(item => {
              const pkg = item._source
              return (
                <Grid item xs={3} key={item._id}>
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
