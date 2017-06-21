import React, { Component } from 'react'
import AutoComplete from 'material-ui/AutoComplete'
import { Link } from 'react-router-dom'
import { Row, Col } from 'react-flexbox-grid'
import { withRouter } from 'react-router-dom'

import { LoginAuth0 } from '../Users'


class Header extends Component {
  state = {
    searchText: ''
  }

  _handleSearchChange = (searchText) => {
    this.setState({ searchText })
  }

  _handleSearchRequest = () => {
    // Route user to Package Detail Page
    console.log(this.state.searchText)
  }

  render() {
    const { title, user } = this.props

    return (
      <header 
        className="pa3"
        style={{ height: '65px', borderBottom: '1px solid lightgray' }}
      >
        <Row className="h-100">
          <Col xs={3}>
            <Row start="xs" middle="xs" className="h-100">
              <Col xs={12}>
                <Link to="/" className="no-underline">
                  <h1 className="normal black f3">{title}</h1>
                </Link>
              </Col>
            </Row>
          </Col>
          <Col xs={6}>
            <Row center="xs" middle="xs" className="h-100">
              <Col xs={12}>
                <AutoComplete
                  hintText="Search for Packages"
                  fullWidth={true}
                  dataSource={[]}
                  value={this.state.searchText}
                  onUpdateInput={this._handleSearchChange}
                  onNewRequest={this._handleSearchRequest}
                />
              </Col>
            </Row>
          </Col>
          <Col xs={3}>
            <Row end="xs" middle="xs" className="h-100">
              <Col xs={12}>
                <LoginAuth0 user={user} />
              </Col>
            </Row>
          </Col>
        </Row>
      </header>
    )
  }
}

Header.defaultProps = {
  title: '<pkg> radar'
}

export default withRouter(Header)