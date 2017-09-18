import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Button from 'material-ui/Button'
import { Link } from 'react-router-dom'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog'
import Typography from 'material-ui/Typography'
import Grid from 'material-ui/Grid'
import { Add } from 'material-ui-icons'
import IconButton from 'material-ui/IconButton'
import TextField from 'material-ui/TextField'
import { withRouter } from 'react-router-dom'
import Avatar from 'material-ui/Avatar'
import Menu, { MenuItem } from 'material-ui/Menu'
import SearchIcon from 'material-ui-icons/Search'

import { SearchMain } from '../Shared'

import CREATE_PACKAGE from '../../mutations/createPackage'

class Header extends Component {
  static defaultProps = {
    title: '<pkg> radar'
  }

  state = {
    isCreatePackageModalOpen: false,
    isCreatePackageURLValid: false,
    createPackageURL: '',
    isUserMenuOpen: false,
    isCreatePackageLoading: false
  }

  _handleUserMenuClick = event => {
    this.setState({
      isUserMenuOpen: true,
      userMenuAnchorEl: event.currentTarget
    })
  }

  _handleUserMenuClose = () => {
    this.setState({ isUserMenuOpen: false })
  }

  _login = () => {
    this.props.githubAuth()
  }

  _logout = () => {
    this.setState({ isUserMenuOpen: false })

    setTimeout(() => {
      localStorage.removeItem('pkgRadarUsername')
      localStorage.removeItem('pkgRadarToken')

      window.location.reload()
    }, 500)
  }

  _handleModalOpen = () => {
    this.setState({ isCreatePackageModalOpen: true })
  }

  _handleModalClose = () => {
    this.setState({ isCreatePackageModalOpen: false })
  }

  _handlePackageURLChange = url => {
    this.setState({ createPackageURL: url })

    if (url.includes('https://github.com')) {
      this.setState({ isCreatePackageURLValid: true })
    } else {
      this.setState({ isCreatePackageURLValid: false })
    }
  }

  _handleCreatePackage = async () => {
    console.log('creating package')
    
    const { user, history } = this.props
    const url = this.state.createPackageURL
    this.setState({ isCreatePackageLoading: true })

    const [owner, name] = url.replace('https://github.com/', '').split('/')
    
    try {
      await this.props.createPackage({
        variables: { owner, name, createdBy: user.username }
      })

      console.log('created package')

      this.setState({
        isCreatePackageModalOpen: false,
        isCreatePackageLoading: false,
        createPackageURL: ''
      })

      history.replace(`/${owner}/${name}`)
    } catch (e) {
      this.setState({
        isCreatePackageModalOpen: false,
        isCreatePackageLoading: false,
        createPackageURL: ''
      })
      console.error(e)
    }
  }

  render() {
    const { githubAuth, history, title, user, isUserLoading, location } = this.props
    // console.log('header props', this.props)

    let userSectionWidth = 9, isSearchVisible = false

    if (location.pathname !== '/') {
      isSearchVisible = true
      userSectionWidth = 2
    }

    return (
      <div>
        <AppBar
          id="Header"
          position="static"
          color='primary'
        >
          <Toolbar
            style={{
              padding: '0 20px',
              width: '100%',
              maxWidth: '1600px',
              margin: '0 auto'
            }}
          >
            <Grid
              container
              align="center"
              style={{ height: '100%' }}
            >
              <Grid item xs={3}  style={{ height: '100%' }}>
                <Grid container align='center'>
                  <Typography
                    type="title"
                    component="h1"
                    style={{
                      fontSize: '24px',
                      display: 'inline-block',
                      paddingRight: '15px',
                      paddingLeft: '10px',
                      borderRight: '2px solid gray'
                    }}
                  >
                    <Link
                      to="/"
                      className="no-underline"
                      style={{ color: 'white' }}
                    >
                      {title}
                    </Link>
                  </Typography>
                  {/* <Link
                    to="/languages"
                    className="no-underline"
                    style={{
                      color: 'white',
                      fontSize: '12px',
                      padding: '0 10px 0 15px',
                      marginTop: '5px'
                    }}
                  >
                    TOP LANGUAGES
                  </Link> */}
                  <Link
                    to="/@dkh215"
                    className="no-underline"
                    style={{
                      color: 'white',
                      fontSize: '12px',
                      padding: '0 10px',
                      marginTop: '5px'
                    }}
                  >
                    DEMO PROFILE
                  </Link>
                  {/* <Link
                    to="/discovery"
                    className="no-underline"
                    style={{
                      color: 'white',
                      fontSize: '12px',
                      padding: '0 10px',
                      marginTop: '5px'
                    }}
                  >
                    DISCOVERY
                  </Link> */}
                </Grid>
              </Grid>
              {isSearchVisible &&
                <Grid
                  item
                  xs={7}
                  style={{
                    borderRadius: '2px',
                    height: '42px',
                    backgroundColor: 'rgba(255,255,255,.15)',
                    color: '#fff',
                    padding: '0'
                  }}
                >
                  <div style={{ height: '100%' }}>
                    <SearchIcon
                      style={{
                        position: 'absolute',
                        margin: '0 10px 0 15px',
                        top: '21px'
                      }}
                    />
                    <SearchMain
                      id='SearchMain--header'
                      placeholder='Search'
                      history={history} 
                    />
                  </div>
                </Grid>}
              <Grid item xs={userSectionWidth} style={{ height: '100%' }}>
                <div className="tr">
                  {!isUserLoading && !user &&
                    <div>
                      {/* <Button
                        onClick={githubAuth}
                        style={{ marginRight: '10px', color: 'white' }}
                      >
                        Log In
                      </Button> */}
                      <Button
                        raised
                        color="default"
                        style={{ marginTop: '5px'}}
                        onClick={githubAuth}
                      >
                        <i className="fa fa-lg fa-github mr2" />
                        Login / Sign Up
                      </Button>
                    </div>}
                  {!isUserLoading && user &&
                    <div>
                      <IconButton
                        onClick={this._handleModalOpen}
                        className="v-mid"
                      >
                        <Add style={{ color: 'white' }} />
                      </IconButton>
                      <Avatar
                        src={user.avatar}
                        alt="User Image"
                        style={{
                          display: 'inline-block',
                          verticalAlign: 'middle',
                          cursor: 'pointer',
                          border: '1px solid white',
                          borderRadius: '0'
                        }}
                        onClick={this._handleUserMenuClick}
                      />
                      <Menu
                        id="simple-menu"
                        anchorEl={this.state.userMenuAnchorEl}
                        open={this.state.isUserMenuOpen}
                        onRequestClose={this._handleUserMenuClose}
                        style={{ marginTop: '40px', width: '150px' }}
                      >
                        <MenuItem onClick={this._handleUserMenuClose}>
                          <Link
                            to={`/@${user.username}`}
                            className="no-underline fw4"
                            style={{ color: 'rgba(0, 0, 0, 0.87)' }}
                          >
                            Profile
                          </Link>
                        </MenuItem>
                        <MenuItem onClick={this._handleUserMenuClose}>
                          <Link
                            to={`/settings`}
                            className="no-underline fw4"
                            style={{ color: 'rgba(0, 0, 0, 0.87)' }}
                          >
                            Settings
                          </Link>
                        </MenuItem>
                        <MenuItem onClick={() => this._logout()}>
                          Logout
                        </MenuItem>
                      </Menu>
                    </div>}
                </div>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>

        <Dialog
          open={this.state.isCreatePackageModalOpen}
          onRequestClose={this._handleModalClose}
        >
          <DialogTitle>Add New Package</DialogTitle>
          <DialogContent style={{ width: '500px' }}>
            <DialogContentText style={{ marginBottom: '10px' }}>
              Enter a valid Github Repo url below:
            </DialogContentText>
            <TextField
              autoFocus
              value={this.state.createPackageURL}
              style={{ width: '100%' }}
              onChange={e => this._handlePackageURLChange(e.target.value)}
              InputProps={{ placeholder: 'https://github.com/facebook/react' }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              className="mr3"
              disabled={this.state.isCreatePackageLoading}
              onClick={this._handleModalClose}
            >
              Cancel
            </Button>
            <Button
              raised
              color="primary"
              disabled={
                !this.state.isCreatePackageURLValid ||
                this.state.isCreatePackageLoading
              }
              onClick={this._handleCreatePackage}
            >
              {this.state.isCreatePackageLoading &&
                <i className="fa fa-spinner fa-spin mr1" />}
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default compose(
  graphql(CREATE_PACKAGE, { name: 'createPackage' }),
)(withRouter(Header))
