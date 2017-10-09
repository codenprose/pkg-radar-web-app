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
import withWidth from 'material-ui/utils/withWidth';
import Hidden from 'material-ui/Hidden';
import Drawer from 'material-ui/Drawer';
import Typography from 'material-ui/Typography'
import Grid from 'material-ui/Grid'
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton'
import TextField from 'material-ui/TextField'
import { withRouter } from 'react-router-dom'
import Avatar from 'material-ui/Avatar'
import Menu, { MenuItem } from 'material-ui/Menu'
import ReactTooltip from 'react-tooltip'
import swal from 'sweetalert2';

import { SearchMain } from '../Shared'

import CREATE_PACKAGE from '../../mutations/createPackage'

const Title = ({ border, color, title }) => (
  <Typography
    type="title"
    component="h1"
    style={{
      fontSize: '24px',
      display: 'inline-block',
      paddingRight: '15px',
      paddingLeft: '10px',
      borderRight: border
    }}
  >
    <Link
      to="/"
      className="no-underline"
      style={{ color }}
    >
      {title}
    </Link>
  </Typography>
)

class Header extends Component {
  static defaultProps = {
    title: '<pkg> radar'
  }

  state = {
    isCreatePackageModalOpen: false,
    isCreatePackageURLValid: false,
    createPackageURL: '',
    isUserMenuOpen: false,
    isCreatePackageLoading: false,
    isDrawerOpen: false
  }

  _toggleDrawer = () => {
    this.setState({ isDrawerOpen: !this.state.isDrawerOpen })
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
    if (this.state.isDrawerOpen) {
      this._toggleDrawer()
    }
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
    if (!this.props.user) {
      return swal({
        text: 'Please Login',
        type: 'info'
      })
    }
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

  _renderUserSection = (avatarBorder, headerFontColor, loginBtnBgColor, alignment) => {
    const { isUserLoading, user } = this.props;

    // TODO: check if user is loading here...
    if (isUserLoading) return <div />

    if (!user) {
      return (
        <div className={alignment}>
          <div>
            <Hidden mdDown>
              <IconButton
                onClick={this._handleModalOpen}
                className="v-mid"
                data-tip='Add Package'
              >
                <Icon style={{ color: headerFontColor }}>
                  add
                </Icon>
              </IconButton>
            </Hidden>
            <ReactTooltip place='bottom' />
            <Button
              raised
              color={loginBtnBgColor}
              style={{ marginTop: '5px'}}
              onClick={this._login}
            >
              <i className="fa fa-lg fa-github mr2" />
              Login / Sign Up
            </Button>
          </div>
        </div>
      )
    } else if (user) {
      return (
        <div className={alignment}>
          <div>
            <Hidden mdDown>
              <IconButton
                onClick={this._handleModalOpen}
                className="v-mid"
                data-tip='Add Package'
              >
                <Icon style={{ color: headerFontColor }}>
                  add
                </Icon>
              </IconButton>
            </Hidden>
            <ReactTooltip place='bottom' />
            <Avatar
              src={user.avatar}
              alt="User Image"
              style={{
                display: 'inline-block',
                verticalAlign: 'middle',
                cursor: 'pointer',
                border: avatarBorder,
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
              <MenuItem onClick={() => this._logout()}>
                Logout
              </MenuItem>
            </Menu>
          </div>
        </div>
      )
    }
  }

  render() {
    const { history, title, location } = this.props
    // console.log('header props', this.props)

    let userSectionWidth = 7;
    let isSearchVisible = false;
    let headerBgColor = '#F7F7F7';
    let headerFontColor = 'black';
    let appBarBoxShadow = 'none';
    let loginBtnBgColor = 'primary';
    let avatarBorder = '2px solid black';
    let drawerBtnColor = 'black';
    let titleSectionWidth = 5;

    if (location.pathname !== '/') {
      isSearchVisible = true;
      userSectionWidth = 3;
      headerBgColor = '#1B2327';
      headerFontColor = 'white';
      appBarBoxShadow = '';
      loginBtnBgColor = 'default';
      avatarBorder = '1px solid white';
      drawerBtnColor = 'white';
      titleSectionWidth = 4;
    }

    return (
      <div>
        <AppBar
          id="Header"
          position="static"
          style={{ 
            background: headerBgColor,
            boxShadow: appBarBoxShadow 
          }}
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
              <Grid 
                item 
                xs={12}
                md={5}
                hidden={{ lgUp: true }}
                style={{
                  margin: '20px 0 10px',
                  textAlign: 'center'
                }}
              >
                <IconButton 
                  style={{ 
                    position: 'absolute',
                    top: '10px',
                    left: 0,
                    color: drawerBtnColor
                  }}
                  onClick={this._toggleDrawer}
                >
                  <Icon>menu</Icon>
                </IconButton>
                <Title
                  border='none'
                  color={headerFontColor}
                  title={title}
                />
              </Grid>
              <Grid 
                item 
                md={5}
                lg={titleSectionWidth}
                hidden={{ mdDown: true }}
              >
                <Grid 
                  container 
                  align='center'
                  style={{ height: '100%' }}
                >
                  <Title
                    border='2px solid gray'
                    color={headerFontColor}
                    title={title}
                  />
                  <Link
                    to="/@dkh215"
                    className="no-underline"
                    style={{
                      color: headerFontColor,
                      fontSize: '12px',
                      padding: '0 10px',
                      marginTop: '5px'
                    }}
                  >
                    DEMO PROFILE
                  </Link>
                </Grid>
              </Grid>
              {isSearchVisible &&
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={5}
                  id='pr-search-main-container'
                >
                  <div style={{ height: '100%' }}>
                    <Icon
                      id='pr-search-icon'
                      style={{
                        position: 'absolute',
                        margin: '0 10px 0 15px'
                      }}
                    >
                      search
                    </Icon>
                    <SearchMain
                      id='SearchMain--header'
                      placeholder='Search'
                      history={history} 
                      autoFocus={false}
                    />
                  </div>
                </Grid>}
              <Grid 
                item
                lg={userSectionWidth}
                hidden={{ mdDown: true }}
                style={{ height: '100%' }}
              >
                {this._renderUserSection(avatarBorder, headerFontColor, loginBtnBgColor, 'tr')}
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>

        <Drawer 
          open={this.state.isDrawerOpen} 
          onRequestClose={this._toggleDrawer}
        >
          <div style={{ width: '225px', padding: '20px' }}>
            <Link
              to="/@dkh215"
              className="no-underline db"
              style={{
                color: 'black',
                fontSize: '14px',
                marginBottom: '20px'
              }}
              onClick={this._toggleDrawer}
            >
              VIEW DEMO PROFILE
            </Link>
            {this._renderUserSection(avatarBorder, headerFontColor, loginBtnBgColor, 'tl')}
            <div style={{ marginTop: '40px' }}>
              Made by: &nbsp;
              <a
                href="https://twitter.com/danielkhunter"
                className="twitter-follow-button no-underline"
                target='_blank'
                rel="noopener noreferrer"
              >
                @danielkhunter
              </a>
            </div>
          </div>
        </Drawer>

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
  withWidth()
)(withRouter(Header))
