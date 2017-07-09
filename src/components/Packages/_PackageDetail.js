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
import showdown from 'showdown'
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


const markdownConverter = new showdown.Converter()

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
          <Grid item md={4} key={name}>
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
    const { data } = this.props
    if (data.loading) return <div></div>

    // console.log(this.props.data)

    const readmeHtml = markdownConverter.makeHtml(data.Package.readme)
    const lastReleaseHtml = markdownConverter.makeHtml(data.Package.lastRelease.description)

    return (
      <div>
        <Grid container>

          <Grid item md={3}>
            {/* Package Title */}
            <Card
              style={{ 
                marginBottom: '15px'
              }}
            >
              <CardHeader
                avatar={
                  <img 
                    alt={`${data.Package.name}-logo`}
                    style={{ height: '40px' }} 
                    src={data.Package.avatar} 
                  />
                }
                title={`${data.Package.owner}/${data.Package.name}`}
                subheader={data.Package.primaryLanguage.name}
              />
              <CardContent style={{ padding: '0 16px' }}>
                {
                  data.Package.tags.map(({name}) => {
                    return (
                      <Link to={`/search?=${name}`} key={name}>
                        <Chip 
                          label={name} 
                          style={{
                            display: 'inline-block', 
                            margin: '0 10px 10px 0',
                            cursor: 'pointer'
                          }} 
                        />
                      </Link>
                    )
                  })
                }
              </CardContent>
              <CardActions>
                {
                  data.Package.homepageUrl &&
                  <Link to={data.Package.homepageUrl} target='_blank' className='no-underline'>
                    <Button dense>View Website</Button>
                  </Link>
                }
                <Link to={data.Package.repoUrl} target='_blank' className='no-underline'>
                  <Button dense>View Repo</Button>
                </Link>
              </CardActions>
            </Card>

            {/* Last Commit */}
            <Card
              style={{ 
                marginBottom: '15px' 
              }}
            >
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
            <Card 
              style={{ 
                marginBottom: '15px' 
              }}
            >
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
            <Card 
              style={{ 
                marginBottom: '15px' 
              }}
            >
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
            <Card
              style={{ 
                marginBottom: '15px' 
              }}
            >
              <CardContent>
                <Typography type="title" component="h2">
                  Issue-to-Star Ratio
                </Typography>
                <Typography type="body1">
                  {Humanize.formatNumber(data.Package.issues / data.Package.stars * 100)}%
                </Typography>
              </CardContent>
            </Card>

            {/* Pull Requests */}
            <Card
              style={{ 
                marginBottom: '15px' 
              }}
            >
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
            <Card 
              style={{ 
                marginBottom: '15px' 
              }}
            >
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
            <Card
              style={{ 
                marginBottom: '15px' 
              }}
            >
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
          <Grid item md={9}>
            <Grid container>
              <Grid item md={9}>
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
              <Grid item md={3}>
                <Button raised style={{ marginRight: '10px' }}>Push</Button>
                <Button raised>Monitor</Button>
              </Grid>
            </Grid>
            <SwipeableViews index={this.state.index} onChangeIndex={this.handleMainContentChangeIndex}>
              <TabContainer>
                <div className='markdown-body' dangerouslySetInnerHTML={{__html: readmeHtml}} />
              </TabContainer>
              <TabContainer>
                <Typography style={{ marginBottom: '10px' }} type="headline" component="h2">
                  {data.Package.lastRelease.name} 
                </Typography>
                <Typography style={{ marginBottom: '10px' }} type="body1" component="p">
                  Published: {data.Package.lastRelease.publishedAt}
                </Typography>
                <div className='markdown-body' dangerouslySetInnerHTML={{__html: lastReleaseHtml}} />
              </TabContainer>
              
              {/* Recommendations */}
              <TabContainer>
                <Grid container>
                  {
                    data.Package.recommendations &&
                    this._renderRecommendations()
                  }
                  
                  {/* Add Recommendation */}
                  <Grid item md={4}>
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