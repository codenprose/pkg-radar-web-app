import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Button from 'material-ui/Button'
import { Link } from 'react-router-dom'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog'
import Typography from 'material-ui/Typography'
import Grid from 'material-ui/Grid'
import { Add } from 'material-ui-icons'
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
      repoURL: this.state.createPackageURL,
      createdBy: this.props.user.id
    }

    console.log('creating package', variables.repoURL)

    this.props.data.createPacakge({ variables })
      .then((response) => {
        const pkg = response.data.createPackage
        console.log('package created', pkg)

        this.props.history.replace(pkg.name)
      })
      .catch((err) => {
        console.error('error creating package', err.message)
      })
  }

  render() {
    const { title, user } = this.props
     
     return (
       <div>
          <AppBar
            position="static"
            color='primary'
          >
            <Toolbar style={{ padding: '0 16px' }}>
              <Grid container align='center' gutter={16}>
                <Grid item md={4}>
                  <Typography type="headline" component='h1'>
                    <Link 
                      to="/" 
                      className='no-underline fw5 white'
                    >
                      {title}
                    </Link>
                  </Typography>
                </Grid>
                <Grid item xs>
                  {
                    user &&
                    <TextField
                      value={this.state.searchText}
                      onChange={(e) => this._handleSearchChange(e.target.value)}
                      className='w-100'
                      InputProps={{ placeholder: 'Search for Packages' }}
                    />
                  }
                </Grid>
                <Grid item md={3}>
                  <div className='tr'>
                   {
                     !user &&
                     <div>
                       {/*<Button
                         className="mr3"
                         color="default"
                         onTouchTap={() => this._login()}
                       >
                         Log In
                      </Button>*/}
                      <Button
                         raised
                         color="default"
                         onTouchTap={() => this._login()}
                       >
                        <i className='fa fa-lg fa-github mr2' />
                         Sign In With Github
                      </Button>
                     </div>
                   }
                   {
                     user &&
                     <div>
                       <IconButton
                         onTouchTap={this._handleModalOpen}
                         className='v-mid'
                       >
                         <Add style={{ color: 'white' }} />
                       </IconButton>
                       <Button
                         raised
                         color='default'
                         onClick={() => this._logout()}
                       >
                         Logout
                      </Button>
                     </div>
                   }
                  </div>
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>

          <Dialog open={this.state.isCreatePackageModalOpen}>
           <DialogTitle>Add New Package</DialogTitle>
           <DialogContent>
             <DialogContentText>
               Enter a valid Github url below:
             </DialogContentText>
             <TextField
               value={this.state.createPackageURL}
               onChange={(e) => this._handlePackageURLChange(e.target.value)}
               InputProps={{ placeholder: 'e.g. https://github.com/facebook/react' }}
             />
           </DialogContent>
           <DialogActions>
             <Button
               className='mr3'
               onTouchTap={this._handleModalClose}
             >
               Cancel
            </Button>
             <Button
               raised
               color="primary"
               disabled={!this.state.isCreatePackageURLValid}
               onTouchTap={this._handleCreatePackage}
             >
               Submit
            </Button>
           </DialogActions>
         </Dialog>
        </div>
     )
  }
}

export default graphql(createPackageMutation, { name: 'createPackage' })(
  withRouter(Header)
)