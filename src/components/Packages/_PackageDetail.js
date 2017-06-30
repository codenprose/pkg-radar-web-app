import React, { Component } from 'react'
import { graphql } from 'react-apollo'

import fetchPackage from '../../queries/fetchPackage'


class PackageDetail extends Component {
  render() {
    const { data } = this.props
    if (data.loading) return <div></div>

    console.log(data)

    return (
      <div>
        <h2>{data.Package.name}</h2>      
      </div>
    )
  }
}

export default graphql(fetchPackage, {
  options: (props) => { return { 
    variables: { name: props.match.params.name } } 
  }
})(PackageDetail)