import React, { Component } from 'react'
import AutoComplete from 'material-ui/AutoComplete'
import { Link } from 'react-router-dom'
import { Row, Col } from 'react-flexbox-grid'
import FlatButton from 'material-ui/FlatButton'
import { graphql } from 'react-apollo'
import RaisedButton from 'material-ui/RaisedButton'
import Dialog from 'material-ui/Dialog'
import IconButton from 'material-ui/IconButton'
import TextField from 'material-ui/TextField'
import { withRouter } from 'react-router-dom'

import createPackageMutation from '../../mutations/createPackage'


class Header extends Component {
  static defaultProps = {
    title: '<pkg> radar'
  }

  state = {
    searchText: '',
    isCreatePackageModalOpen: false,
    isCreatePackageURLValid: false,
    createPackageURL: ''
  }

  _handleSearchChange = (searchText) => {
    this.setState({ searchText })
  }

  _handleSearchRequest = () => {
    // Route user to Package Detail Page
    console.log(this.state.searchText)
  }

   _login = () => {
    this.props.auth.show()
  }

  _logout = () => {
    // remove token from local storage and reload page to reset apollo client
    window.localStorage.removeItem('auth0IdToken')
    window.location.reload('/')
  }

  _handleModalOpen = () => {
    this.setState({ isCreatePackageModalOpen: true })
  }

  _handleModalClose = () => {
    this.setState({ isCreatePackageModalOpen: false })
  }

  _handlePackageURLChange = (url) => {
    this.setState({ createPackageURL: url })

    if (url.includes('https://github.com')) {
      this.setState({ isCreatePackageURLValid: true })
    } else {
      this.setState({ isCreatePackageURLValid: false })
    }
  }

  _handleCreatePackage = () => {
    const variables = {
      repoURL: this.state.createPackageURL
    }

    this.props.data.createPacakge({ variables })
      .then((response) => {
        console.log(response.data.createPackage)
      })
      .catch((err) => {
        console.error(err.message)
      })
  }

  render() {
    const { title, user } = this.props

    const modalActions = [
      <FlatButton
        label="Cancel"
        onTouchTap={this._handleModalClose}
        style={{ marginRight: '10px' }}
      />,
      <RaisedButton
        label="Submit"
        primary={true}
        disabled={!this.state.isCreatePackageURLValid}
        onTouchTap={this._handleCreatePackage}
      />
    ]

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
                {
                  !user &&
                  <div>
                    <FlatButton
                      label="Log In"
                      style={{ marginRight: '20px' }}
                      onClick={() => this._login()}
                    />
                    <RaisedButton
                      primary={true}
                      label="Sign Up"
                      onClick={() => this._login()}
                    />
                  </div>
                }
                {
                  user &&
                  <div>
                    <IconButton
                      iconClassName="material-icons"
                      tooltip="Add Package"
                      onTouchTap={this._handleModalOpen}
                      style={{ verticalAlign: 'middle' }}
                    >
                      add
                    </IconButton>
                    <RaisedButton
                      label="Log Out"
                      style={{ marginRight: '20px' }}
                      onClick={() => this._logout()}
                    />
                  </div>
                }
              </Col>
            </Row>
          </Col>
        </Row>
        <Dialog
          title="Add New Package"
          actions={modalActions}
          modal={true}
          open={this.state.isCreatePackageModalOpen}
        >
          <p>Enter a valid Github url below:</p>
          <TextField
            fullWidth
            hintText='e.g. https://github.com/facebook/react'
            value={this.state.createPackageURL}
            onChange={(e) => this._handlePackageURLChange(e.target.value)}
          />
        </Dialog>
      </header>
    )
  }
}

export default graphql(createPackageMutation, { name: 'createPackage' })(
  withRouter(Header)
)