import React, { Component } from 'react'

class About extends Component {
  static defaultProps = {
    title: '<pkg> radar'
  }

  render() {
    const { title } = this.props;

    return (
      <div style={{ maxWidth: '1040px' }}>
        <p style={{ fontSize: '20px', lineHeight: '1.5' }}>
          <strong>{title}</strong> is a search and discovery tool for open source software that allows users to
          organize packages into four meaningful categories: Backlog, Trial, Production, Archive.
        </p>
      </div>
    )
  }
}

export default About