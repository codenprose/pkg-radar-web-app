import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import Card, { CardContent, CardActions } from 'material-ui/Card'
import Tabs, { Tab } from 'material-ui/Tabs'
import Button from 'material-ui/Button'
import SwipeableViews from 'react-swipeable-views'
import Humanize from 'humanize-plus'
import showdown from 'showdown'

import 'github-markdown-css/github-markdown.css'

import fetchPackage from '../../queries/fetchPackage'

const markdownConverter = new showdown.Converter()

const TabContainer = props =>
  <div style={{ padding: '24px' }}>
    {props.children}
  </div>


class PackageDetail extends Component {
  state = {
    index: 0,
  }

  handleMainContentTabChange = (event, index) => {
    this.setState({ index });
  };

  handleMainContentChangeIndex = index => {
    this.setState({ index });
  };

  render() {
    const { data } = this.props
    if (data.loading) return <div></div>

    console.log(data)

    const readmeHtml = markdownConverter.makeHtml(JSON.parse(data.Package.readme).text)

    return (
      <div>
        <Grid container>

          <Grid item md={3}>
            {/* Package Title */}
            <Card
              style={{ 
                border: `2px solid ${data.Package.primaryLanguage.color}`,
                marginBottom: '15px'
              }}
            >
              <CardContent>
                <Typography type="title" component="h2" style={{ marginBottom: '10px' }}>
                  {Humanize.capitalizeAll(data.Package.name)}
                </Typography>
                <Typography type="body1" style={{ marginBottom: '10px' }}>
                  Primary Language: {data.Package.primaryLanguage.name}
                </Typography>
                <Typography type="body1">
                  {data.Package.description}
                </Typography>
              </CardContent>
            </Card>

            {/* Package Stars */}
            <Card style={{ marginBottom: '15px' }}>
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
            <Card style={{ marginBottom: '15px' }}>
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
            <Card style={{ marginBottom: '15px' }}>
              <CardContent>
                <Typography type="title" component="h2">
                  Issue-to-Star Ratio
                </Typography>
                <Typography type="body1">
                  {Humanize.formatNumber(data.Package.issues / data.Package.stars * 100)}%
                </Typography>
              </CardContent>
            </Card>

            {/* Last Commit */}
            <Card style={{ marginBottom: '15px' }}>
              <CardContent>
                <Typography type="title" component="h2">
                  Last Commit
                </Typography>
                <Typography type="body1">
                  {data.Package.lastCommit.author.date}
                </Typography>
              </CardContent>
              <CardActions>
                <Button dense>View Commit</Button>
              </CardActions>
            </Card>

            {/* Pull Requests */}
            <Card style={{ marginBottom: '15px' }}>
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
            <Card style={{ marginBottom: '15px' }}>
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
            <Card style={{ marginBottom: '15px' }}>
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

          <Grid item md={9}>
            <Tabs
              index={this.state.index}
              onChange={this.handleMainContentTabChange}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab label="README" />
              <Tab label="LATEST RELEASE" />
              <Tab label="ANALYTICS" />
            </Tabs>
            <SwipeableViews index={this.state.index} onChangeIndex={this.handleMainContentChangeIndex}>
              <TabContainer>
                <div className='markdown-body' dangerouslySetInnerHTML={{__html: readmeHtml}} />
              </TabContainer>
              <TabContainer>{'Item Two'}</TabContainer>
              <TabContainer>{'Item Three'}</TabContainer>
            </SwipeableViews>
          </Grid>
          
        </Grid>
      </div>
    )
  }
}

export default graphql(fetchPackage, {
  options: (props) => { return { 
    variables: { name: props.match.params.name } } 
  }
})(PackageDetail)