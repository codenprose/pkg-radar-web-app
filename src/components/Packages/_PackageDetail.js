import React, { Component } from 'react'
import { graphql, compose } from 'react-apollo'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card'
import { Link } from 'react-router-dom'
import Tabs, { Tab } from 'material-ui/Tabs'
import Button from 'material-ui/Button'
import SwipeableViews from 'react-swipeable-views'
import Humanize from 'humanize-plus'
import marked from 'marked'
import Chip from 'material-ui/Chip'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import moment from 'moment'

import 'github-markdown-css/github-markdown.css'

import fetchPackage from '../../queries/fetchPackage'
import updatePackageRecommendations from '../../mutations/updatePackageRecommendations'

const TabContainer = props =>
  <div style={{ padding: '24px' }}>
    {props.children}
  </div>

class PackageDetail extends Component {
  state = {
    index: 0,
    isModalOpen: false,
    recommendationSearch: '',
    recommendationSelection: {}
  }

  handleMainContentTabChange = (event, index) => {
    this.setState({ index })
  }

  handleMainContentChangeIndex = (index) => {
    this.setState({ index })
  }

  _handleModalOpen = () => {
    this.setState({ isModalOpen: true })
  }

  _handleModalClose = () => {
    this.setState({ isModalOpen: false })
  }

  _handleRecommendationSearch = (pkg) => {
    this.setState({ recommendationSearch: pkg })
  }

  _handleAddRecommendation = () => {
    // TODO: check if recommendation already exists
    const variables = {
      recommendations: [
        ...this.props.data.Package.recommendations, 
        this.state.recommendationSelection
      ]
    }

    console.log('adding recommendation')

    this.props.updatePackageRecommendations({ variables })
      .then((response) => {
        console.log(response)
      })
      .catch((err) => {
        console.error('error creating package', err.message)
      })
  }

  _renderRecommendations = () => {
    const { Package } = this.props.data
    return Package.recommendations.map(({ name, avatar, stars, description }) => {
      return (
          <Grid item xs={4} key={name}>
            <Card style={{ marginBottom: '15px' }}>
              <CardHeader
                avatar={
                  <img
                    alt={`${name}-logo`}
                    style={{ height: '40px' }}
                    src={avatar}
                  />
                }
                title={name}
                subheader="Stars: 32,197"
              />
              <CardContent style={{ padding: '0 16px' }}>
                <Typography type="body1" component="p">
                  {description}
                </Typography>
              </CardContent>
              <CardActions>
                <Link to={`/package/${name}`} className='no-underline'>
                  <Button dense>View Package</Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>
      )
    })
  }

  render() {
    const { data, history } = this.props
    if (data.loading) return <div></div>

    let readmeHtml = '<div>No Data Available</div>'
    let changelogHtml = '<div>No Data Available</div>'
    
    if (data.Package.lastRelease) {
      changelogHtml = marked(data.Package.lastRelease.description)
    }

    if (data.Package.changelog) {
      changelogHtml = marked(data.Package.changelog)
    }

    if (data.Package.readme) {
      readmeHtml = marked(data.Package.readme)
    }

    const styles = {
      card: {
        marginBottom: '15px',
        boxShadow: '5px 5px 25px 0px rgba(46,61,73,0.2)'
      },
    }

    return (
      <div>
        <Grid container>

          <Grid item xs={3}>
            {/* Package Title */}
             <Card style={styles.card}>
              <CardHeader
                avatar={
                  <img 
                    alt={`${data.Package.name}-logo`}
                    style={{ height: '42px' }} 
                    src={data.Package.avatar} 
                  />
                }
                title={`${data.Package.owner}/${data.Package.name}`}
                subheader={data.Package.primaryLanguage.name}
              />
              <CardActions>
                {
                  data.Package.homepageUrl &&
                  <Link to={data.Package.homepageUrl} target='_blank' className='no-underline'>
                    <Button dense>Website</Button>
                  </Link>
                }
                <Link to={data.Package.repoUrl} target='_blank' className='no-underline'>
                  <Button dense>Repo</Button>
                </Link>
              </CardActions>
            </Card> 
            
            {/* Tags */}
            <Card style={styles.card}>
              <CardContent style={{ paddingBottom: 0 }}>
                <Typography type="title" component="h2">
                  Tags
                </Typography>
                <div style={{ marginTop: '20px' }}>
                  {
                    data.Package.tags.map(({text}) => {
                      return (
                        <Link to={`/search?=${text}`} key={text}>
                          <Chip 
                            label={text} 
                            style={{
                              display: 'inline-block', 
                              margin: '0 10px 10px 0',
                              cursor: 'pointer',
                              borderRadius: 0
                            }} 
                          />
                        </Link>
                      )
                    })
                  }
                </div>
              </CardContent>
              <CardActions>
                <Button 
                  dense 
                  onClick={() => history.push(`/package/update/${data.Package.name}`)}
                >
                  Update Tags
                </Button>
              </CardActions>
            </Card>

            {/* Last Commit */}
            <Card style={styles.card}>
              <CardContent>
                <Typography type="title" component="h2">
                  Last Commit
                </Typography>
                <Typography type="body1">
                  {moment(data.Package.lastCommit.author.date).format("MMMM Do, YYYY")}
                </Typography>
              </CardContent>
              <CardActions>
                <Link to={data.Package.lastCommit.commitUrl} target='_blank' className='no-underline'>
                  <Button dense>View Commit</Button>
                </Link>
              </CardActions>
            </Card>

            {/* Package Stars */}
            <Card style={styles.card}>
              <CardContent>
                <Typography type="title" component="h2">
                  Stars
                </Typography>
                <Typography type="body1">
                  {Humanize.formatNumber(data.Package.stars)}
                </Typography>
              </CardContent>
            </Card>

            {/* Package Issues */}
            <Card style={styles.card}>
              <CardContent>
                <Typography type="title" component="h2">
                  Issues
                </Typography>
                <Typography type="body1">
                  {Humanize.formatNumber(data.Package.issues)}
                </Typography>
              </CardContent>
            </Card>

            {/* Package Star-to-Issue ratio */}
            {/* <Card style={styles.card}>
              <CardContent>
                <Typography type="title" component="h2">
                  Issue-to-Star Ratio
                </Typography>
                <Typography type="body1">
                  {Humanize.formatNumber(data.Package.issues / data.Package.stars * 100)}%
                </Typography>
              </CardContent>
            </Card> */}

            {/* Pull Requests */}
            <Card style={styles.card}>
              <CardContent>
                <Typography type="title" component="h2">
                  Pull Requests
                </Typography>
                <Typography type="body1">
                  {Humanize.formatNumber(data.Package.pullRequests)}
                </Typography>
              </CardContent>
              <CardActions>
                <Button dense>View Pull Requests</Button>
              </CardActions>
            </Card>

            {/* Contributors */}
            <Card style={styles.card}>
              <CardContent>
                <Typography type="title" component="h2">
                  Contributors
                </Typography>
                <Typography type="body1">
                  Add Contributors
                </Typography>
              </CardContent>
              <CardActions>
                <Button dense>View Contributors</Button>
              </CardActions>
            </Card>

            {/* License */}
            <Card style={styles.card}>
              <CardContent>
                <Typography type="title" component="h2">
                  License
                </Typography>
                <Typography type="body1">
                  {data.Package.license}
                </Typography>
              </CardContent>
              <CardActions>
                <Button dense>View License</Button>
              </CardActions>
            </Card>

          </Grid>

          {/* Tabs */}
          <Grid item xs={9}>
            <Grid container>
              {/* <Grid item xs={12}>
                <div style={{ marginBottom: '5px' }}>
                  <Typography 
                    style={{ display: 'inline-block', color: 'rgb(1%, 40%, 84%)' }} 
                    type="headline"
                  >
                    {data.Package.owner} / {data.Package.name}
                  </Typography>
                </div>
                <Typography style={{ marginBottom: '15px' }} type="subheading">
                  {data.Package.description}
                </Typography>
                {
                  data.Package.tags.map(({text}) => {
                    return (
                      <Link to={`/search?=${text}`} key={text}>
                        <Chip 
                          label={text} 
                          style={{
                            display: 'inline-block', 
                            margin: '0 10px 10px 0',
                            cursor: 'pointer',
                            borderRadius: 0
                          }} 
                        />
                      </Link>
                    )
                  })
                }
                <Button dense raised>Update Tags</Button>
              </Grid> */}
              <Grid style={{ paddingTop: 0 }} item xs={9}>
                <Tabs
                  index={this.state.index}
                  onChange={this.handleMainContentTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  fullWidth
                >
                  <Tab label="Readme" />
                  <Tab label="Latest Release" />
                  <Tab label="Recommendations" />
                  <Tab label="Analytics" />
                </Tabs>
              </Grid>
              <Grid item xs={3}>
                <Button raised style={{ marginRight: '10px' }}>Save To Board</Button>
                {/* <Button raised>Monitor</Button> */}
              </Grid>
            </Grid>
            <SwipeableViews index={this.state.index} onChangeIndex={this.handleMainContentChangeIndex}>
              <TabContainer>
                <div className='markdown-body' dangerouslySetInnerHTML={{__html: readmeHtml}} />
              </TabContainer>
              <TabContainer>
                {
                  data.Package.lastRelease &&
                  <div>
                    <Typography style={{ marginBottom: '10px' }} type="display1" component="h2">
                      {data.Package.lastRelease.name} 
                    </Typography>
                    <Typography style={{ marginBottom: '20px' }} type="body1" component="p">
                      Published: {moment(data.Package.lastRelease.publishedAt).format("MMMM Do, YYYY")}
                    </Typography>
                  </div>
                }
                <div className='markdown-body' dangerouslySetInnerHTML={{__html: changelogHtml}} />
              </TabContainer>
              
              {/* Recommendations */}
              <TabContainer>
                <Grid container>
                  {
                    data.Package.recommendations &&
                    this._renderRecommendations()
                  }
                  
                  {/* Add Recommendation */}
                  <Grid item xs={4}>
                    <Grid 
                      container 
                      align='center' 
                      justify='center'
                      style={{ height: '100%' }}
                    >
                      <Grid item>
                        <Button raised onClick={() => this._handleModalOpen()}>
                          Add Recommendation
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/* /Add Recommendation */}
                </Grid>
              </TabContainer>
              
              <TabContainer>{'Analytics'}</TabContainer>
            </SwipeableViews>
          </Grid>
          
        </Grid>

        <Dialog 
          style={{ width: '100%' }} 
          open={this.state.isModalOpen}
          onRequestClose={this._handleModalClose}
        >
           <DialogTitle>Add New Package</DialogTitle>
           <DialogContent style={{ width: '500px' }}>
             <TextField
               autoFocus
               style={{ width: '100%' }}
               value={this.state.recommendationSearch}
               placeholder='Search for Package'
               onChange={(e) => this._handleRecommendationSearch(e.target.value)}
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
               onTouchTap={this._handleAddRecommendation}
             >
               Submit
            </Button>
           </DialogActions>
         </Dialog>
      </div>
    )
  }
}

const fetchPackageOptions = {
  options: (props) => { return { 
    variables: { name: props.match.params.name } } 
  }
}

export default compose(
  graphql(fetchPackage, fetchPackageOptions),
  graphql(updatePackageRecommendations, { name: 'updatePackageRecommendations'})
)(PackageDetail)