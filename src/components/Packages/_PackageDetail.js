import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import Grid from "material-ui/Grid";
import Typography from "material-ui/Typography";
import Card, { CardHeader, CardContent, CardActions } from "material-ui/Card";
import { Link } from "react-router-dom";
import Tabs, { Tab } from "material-ui/Tabs";
import Button from "material-ui/Button";
import SwipeableViews from "react-swipeable-views";
import Humanize from "humanize-plus";
import marked from "marked";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from "material-ui/Dialog";
import styled from "styled-components";
import moment from "moment";
import Select from 'react-select';
import find from 'lodash/find'
import filter from 'lodash/filter'
import truncate from 'lodash/truncate'
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts'
import elasticsearch from 'elasticsearch'

import { Loader } from '../Shared'

import CURRENT_USER from '../../queries/currentUser'
import GET_PACKAGE from '../../queries/package'
import USER_KANBAN_PACKAGES from '../../queries/userKanbanPackages'
import UPDATE_KANBAN_CARDS from '../../mutations/updateKanbanCards';
import CREATE_USER_KANBAN_PACKAGE from '../../mutations/createUserKanbanPackage'

import radarBgImg from "../../images/nathan_anderson_radar.jpg"

import "github-markdown-css/github-markdown.css";

const rst2mdown = require('rst2mdown');
const Text = require('react-format-text');

const esClient = new elasticsearch.Client({
  host: process.env.ELASTIC_SEARCH_ENDPOINT
});

const PackageDetailHeader = styled.div`
  position: relative;
  z-index: 1;
  height: 250px;
  width: 100%;
  margin-bottom: 20px;
  background: url("${radarBgImg}") no-repeat center;
  background-size: cover;

  &:after {
    content: "";
    position: absolute;
    z-index: -2;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(0, 0, 0, .3), rgba(0, 0, 0, .3));
  }
`;

const TabContainer = props =>
  <div 
    style={{ 
      position: "relative", 
      marginTop: "20px",
      overflowX: 'hidden', 
      overflowY: 'hidden'
    }}
  >
    {props.children}
  </div>;

class PackageDetail extends Component {
  state = {
    index: 0,
    recommendations: [],
    isAddPackageModalOpen: false,
    areRecommendationsLoading: false,
    isAddPackageLoading: false,
    selectedStatus: '',
    selectedBoard: '',
  };

  static defaultProps = {
    kanbanStatusOptions: [
      { label: 'Backlog', value: 'backlog' },
      { label: 'Trial', value: 'trial' },
      { label: 'Production', value: 'production' },
      { label: 'Archive', value: 'archive' }
    ],
    packageHistory: [
      { month: 'January', backlog: 15, trial: 72, production: 3, archive: 0 },
      { month: 'February', backlog: 30, trial: 57, production: 10, archive: 3 },
      { month: 'March', backlog: 52, trial: 22, production: 21, archive: 5 },
      { month: 'April', backlog: 55, trial: 15, production: 25, archive: 5 },
      { month: 'May', backlog: 42, trial: 17, production: 33, archive: 8 },
      { month: 'June', backlog: 16, trial: 14, production: 61, archive: 9 },
      { month: 'July', backlog: 9, trial: 7, production: 75, archive: 9 },
      { month: 'August', backlog: 3, trial: 2, production: 86, archive: 9 },
    ]
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ index: 0 })
  }

  _formatKanbanCards = () => {
    const kanbanCards = this.props.currentUser.kanbanCards
    let cards = []

    for (let item in kanbanCards) {
      const card = kanbanCards[item]
      const { board, ownerName, packageName } = card
      cards.push({ board, ownerName, packageName })
    }
    return cards
  }

  _handleAddPackage = async () => {
    const { currentUser, data } = this.props
    const { selectedStatus, selectedBoard} = this.state

    this.setState({ isAddPackageLoading: true })

    try {
      console.log('adding package')
      await this.props.createUserKanbanPackage({
        variables: {
          ownerName: data.package.ownerName,
          packageId: data.package.id,
          packageName: data.package.packageName,
          status: selectedStatus,
          username: currentUser.username
        },
        refetchQueries: [{ 
          query: USER_KANBAN_PACKAGES, 
          variables: { username: currentUser.username }
        }]
      });
      console.log('added package')

      console.log('updating cards')
      const token = localStorage.getItem('pkgRadarToken')
      const kanbanCards = this._formatKanbanCards()
      const card = { 
        board: selectedBoard, 
        ownerName: data.package.ownerName,
        packageName: data.package.packageName,
      }

      await this.props.updateKanbanCards({
        variables: { 
          username: currentUser.username, 
          kanbanCards: [...kanbanCards, card]
        },
        refetchQueries: [{
          query: CURRENT_USER,
          variables: { username: currentUser.username, token }
        }]
      });
      console.log('updated cards')
      this.setState({ 
        isAddPackageLoading: false, 
        isAddPackageModalOpen: false 
      })
    } catch (e) {
      console.error(e.message);
      this.setState({ 
        isAddPackageLoading: false, 
        isAddPackageModalOpen: false 
      })
    }
  };

  _handleBoardSelection = option => {
    if (option) {
      this.setState({ selectedBoard: option.value });
    }
  };

  _handleStatusSelection = option => {
    if (option) {
      this.setState({ selectedStatus: option.value });
    }
  };

  handleMainContentTabChange = (event, index) => {
    if (index === 2) {
      this._handleRecommendationsSearch()
    }
    this.setState({ index });
  };

  _formatTagsForQuery = () => {
    const { language, tags } = this.props.data.package;
    const filtered = filter(tags, (t) => t !== language)
    return filtered.join(' ')
  }

  _handleRecommendationsSearch = () => {
    const { language, tags } = this.props.data.package;
    if (!language || !tags.length) return

    this.setState({ areRecommendationsLoading: true });
    const formattedTags = this._formatTagsForQuery();

    esClient.search({
      index: process.env.ELASTIC_SEARCH_INDEX,
      body: {
        "from" : 0, "size" : 30,
        "query": {
          "multi_match": {
            "query": formattedTags,
            "fields": ["tags", "description"],
            "operator": "OR",
            "type": "most_fields"
          }
        }, 
        "post_filter": {
          "term": {
            "tags": language.toLowerCase()
          }
        }
      }
    }).then(body => {
      const hits = body.hits.hits
      // console.log('hits', hits)
      if (hits.length) {
        this.setState({ recommendations: hits, areRecommendationsLoading: false })
      } else {
        this.setState({ areRecommendationsLoading: false })
      }
    }, error => {
      this.setState({ areRecommendationsLoading: false })
      console.trace(error.message);
    })
  };

  _renderRecommendations = () => {
    const { areRecommendationsLoading, recommendations } = this.state;
    
    if (areRecommendationsLoading) return

    if (!recommendations.length) {
      return (
        <Grid item xs={12}>
          <h3 style={{ position: 'absolute' }}>No Recommendations</h3>
        </Grid>
      )
    }
    
    return recommendations.map((item, i) => {
        const pkg = item._source
        return (
          <Grid item xs={12} md={6} xl={4} key={i}>
            <Card
              style={{
                marginBottom: "15px",
              }}
            >
              <CardHeader
                avatar={
                  <img
                    alt={`${pkg.package_name}-logo`}
                    style={{ height: "40px" }}
                    src={pkg.owner_avatar}
                  />
                }
                title={pkg.package_name}
                subheader={`Stars: ${Humanize.formatNumber(pkg.stars)}`}
              />
              <CardContent style={{ padding: "0 16px", minHeight: '40px' }}>
                <Typography type="body1" component="p">
                  {pkg.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Link to={`/${pkg.owner_name}/${pkg.package_name}`} className="no-underline">
                  <Button dense>View Package</Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>
        );
      }
    );
  };

  _openPackageModal = () => {
    if (!this.props.currentUser) {
      return alert('Please login to save packages')
    }
    this.setState({ isAddPackageModalOpen: true });
  };

  _closePackageModal = () => {
    this.setState({ isAddPackageModalOpen: false });
  };

  _formatBoardSelectItems = () => {
    const { kanbanBoards } = this.props.currentUser;
    const arr = [];

    for (let item in kanbanBoards) {
      const board = kanbanBoards[item];
      arr.push({ label: board, value: board });
    }
    return arr;
  };

  _checkIfPackageIsSaved = () => {
    const { currentUser, data } = this.props
    if (!currentUser) return false
    
    const saved = find(currentUser.kanbanCards, (card) => {
      if (card && data.package) {
        return card.ownerName === data.package.ownerName &&
          card.packageName === data.package.packageName
      }
      return false
    })
    return typeof(saved) === 'object'
  }

  _renderTags = () => {
    const { data } = this.props
    if (data.package.tags.length) {
      return data.package.tags.map((tag, i) => {
        return (
          <Link 
            to={`/search?q=${tag}`} 
            key={i}
            className='pointer:hover white no-underline'
            style={{ margin: '0 10px 10px 0' }}
          >
            {tag}
          </Link>
        )
      })
    }
  }

  render() {
    const { currentUser, data, isUserLoading } = this.props;
    if (data.loading || isUserLoading || !data.package) return <Loader />
    // console.log('props', this.props)
    // console.log('current user', currentUser)

    let isPackageSaved = this._checkIfPackageIsSaved()
    let addPackageBtnText = 'Save'
    let addPackageBtnColor = 'white'
    let addPackageBtnBgColor = '#1B2327'

    if (isPackageSaved) {
      addPackageBtnText = 'Saved'
      addPackageBtnColor = 'white'
      addPackageBtnBgColor = '#4CAF50'
    }

    let readmeHtml = "<div>No Data Available</div>";
    let changelogHtml = "<div>No Data Available</div>";

    if (data.package.lastRelease) {
      changelogHtml = marked(data.package.lastRelease.description);
    }

    if (data.package.readme.text && data.package.readme.extension === "md") {
      readmeHtml = marked(data.package.readme.text);
    } else if (data.package.readme.text && data.package.readme.extension === "rst") {
      const md = rst2mdown(data.package.readme.text)
      readmeHtml = marked(md)
    } else {
      readmeHtml = marked(data.package.readme.text);
    }

    const styles = {
      card: {
        marginBottom: "15px"
      }
    };

    return (
      <div>
        <Grid container>
          <Grid item xs={3}>

            {/* Package Stats */}
            <Card style={styles.card}>
              <CardContent>
                <Typography style={{ marginBottom: '20px '}} type="title" component="h3">
                  Stats
                </Typography>
                <Grid container>
                  <Grid item xs={12} xl={6}>
                    <ul className='list pl0 dib mt0 mb0'>
                      <li>
                        <Typography type="body1">
                          <i className="fa fa-star fa-fw mr1" aria-hidden="true" />
                          {Humanize.formatNumber(data.package.stars)} Stars
                        </Typography>
                      </li>
                      <li>
                        <Typography type="body1">
                          <i className="fa fa-exclamation-circle fa-fw mr1" aria-hidden="true" />
                          {Humanize.formatNumber(data.package.issues)} Issues
                        </Typography>
                      </li>
                      <li>
                        <Typography type="body1">
                          <i className="fa fa-plus-circle fa-fw mr1" aria-hidden="true" />
                          {Humanize.formatNumber(data.package.commits.total)} Commits
                        </Typography>
                      </li>
                      <li>
                        <Typography type="body1">
                          <i className="fa fa-tags fa-fw mr1" aria-hidden="true" />
                          {Humanize.formatNumber(data.package.releases)} Releases
                        </Typography>
                      </li>
                    </ul>
                  </Grid>
                  <Grid item xs={12} xl={6}>
                    <ul className='list pl0 dib mt0 mb0'>
                      <li>
                        <Typography type="body1">
                          <i className="fa fa-users fa-fw mr1" aria-hidden="true" />
                          {Humanize.formatNumber(data.package.contributors.total)} Contributors
                        </Typography>
                      </li>
                      <li>
                        <Typography type="body1">
                          <i className="fa fa-eye fa-fw mr1" aria-hidden="true" />
                          {Humanize.formatNumber(data.package.watchers)} Watchers
                        </Typography>
                      </li>
                      <li>
                        <Typography type="body1">
                          <i className="fa fa-hand-paper-o fa-fw mr1" aria-hidden="true" />
                          {Humanize.formatNumber(data.package.pullRequests)} Pull Requests
                        </Typography>
                      </li>
                      <li>
                        <Typography type="body1">
                          <i className="fa fa-code-fork fa-fw mr1" aria-hidden="true" />
                          {Humanize.formatNumber(data.package.forks)} Forks
                        </Typography>
                      </li>
                    </ul>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Last Commit */}
            <Card style={styles.card}>
              <CardContent style={{ paddingBottom: 0 }}>
                <Typography style={{ marginBottom: '20px '}} type="title" component="h3">
                  Last Commit
                </Typography>
                <Typography type="body1">
                  {moment(data.package.lastCommit.author.date).format(
                    "MMMM Do, YYYY"
                  )}
                </Typography>
              </CardContent>
              <CardActions>
                <Link
                  to={data.package.lastCommit.commitUrl}
                  target="_blank"
                  className="no-underline"
                  rel="noopener noreferrer"
                >
                  <Button dense>View Commit</Button>
                </Link>
              </CardActions>
            </Card>

            {/* Contributors */}
            <Card style={styles.card}>
              <CardContent>
                <Typography style={{ marginBottom: '20px '}} type="title" component="h3">
                  Contributors
                </Typography>
                {
                  data.package.contributors.top100.map(contributor => {
                    return (
                      <a
                        key={contributor.username} 
                        href={contributor.url} 
                        style={{ marginRight: '10px' }}
                      >
                        <img 
                          alt='contributor'
                          style={{ width: '32px' }} 
                          src={contributor.avatar} 
                        />
                      </a>
                    )
                  })
                }
              </CardContent>
              <CardActions>
                <a
                  href={`https://github.com/${data.package.ownerName}/${data.package.packageName}/graphs/contributors`} 
                  className="no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button dense>View Contributors</Button>
                </a>
              </CardActions>
            </Card>

            {/* License */}
            <Card style={styles.card}>
              <CardContent>
                <Typography style={{ marginBottom: '20px '}} type="title" component="h3">
                  License
                </Typography>
                <Typography type="body1">
                  {
                    data.package.license ?
                      data.package.license :
                        'No License Provided'
                  }
                </Typography>
              </CardContent>
              <CardActions>
                <a
                  href={`https://github.com/${data.package.ownerName}/${data.package.packageName}/blob/master/LICENSE`}
                  className="no-underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button dense>View License</Button>
                </a>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={9} style={{ paddingLeft: '20px' }}>
            <PackageDetailHeader>
              <Grid
                container
                direction="row"
                align="center"
                style={{ height: "100%", padding: "0 20px", margin: 0 }}
              >
                <Grid item xs={12} style={{ paddingBottom: 0 }}>
                  <Grid container>
                    <Grid item>
                      <img
                        alt={`${data.package.packageName}-logo`}
                        style={{ 
                          height: "50px", 
                          marginRight: '20px',
                          borderRadius: '50%'
                        }}
                        src={data.package.ownerAvatar}
                      />
                    </Grid>
                    <Grid item>
                      <Typography 
                        type="headline" 
                        gutterBottom
                        style={{ color: 'white', display: 'inline-block' }}
                      >
                      {data.package.ownerName} / {data.package.packageName}
                      <div style={{ fontSize: '16px' }}>
                        {truncate(data.package.description, { length: 102 })}
                      </div>
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <div className='mb3'>
                    <a
                      href={data.package.websiteUrl}
                      className='pointer:hover white no-underline mr3'
                      target='_blank'
                      rel="noopener noreferrer"
                    >
                      <i className="fa fa-globe mr2" aria-hidden="true" />
                      Website
                    </a>
                    <a
                      href={data.package.repoUrl}
                      className='pointer:hover white no-underline mr2'
                      target='_blank'
                      rel="noopener noreferrer"
                    >
                      <i className="fa fa-github mr2" aria-hidden="true" />
                      Repo
                    </a>
                  </div>
                  <i className="fa fa-tags mr2 white" aria-hidden="true" />
                  {this._renderTags()}
                </Grid>
              </Grid>
            </PackageDetailHeader>
            <Grid container>
              <Grid style={{ paddingTop: 0 }} item xs={10}>
                <Tabs
                  value={this.state.index}
                  onChange={this.handleMainContentTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  fullWidth
                >
                  <Tab label="Readme" />
                  <Tab label="Latest Release" />
                  <Tab label="Recommendations" />
                  <Tab label="Radar" />
                </Tabs>
              </Grid>
              <Grid item xs={2}>
                <Button 
                  raised
                  disabled={isPackageSaved}
                  onClick={this._openPackageModal}
                  style={{ 
                    color: addPackageBtnColor,
                    backgroundColor: addPackageBtnBgColor,
                    marginRight: "10px",
                    float: 'right'
                  }}
                >
                  {addPackageBtnText}
                </Button>
              </Grid>
            </Grid>
            <SwipeableViews
              index={this.state.index}
              onChangeIndex={this.handleMainContentTabChange}
            >
              <TabContainer>
                {
                  (
                    data.package.readme.extension === "md" ||
                    data.package.readme.extension === "rst"
                  ) &&
                  <div
                    className="markdown-body"
                    dangerouslySetInnerHTML={{ __html: readmeHtml }}
                  />
                }
                {
                  data.package.readme.extension === "txt" &&
                  <div className="markdown-body">
                    <Text>{data.package.readme}</Text>
                  </div>
                }
                {
                  !data.package.readme.extension &&
                  <div
                    className="markdown-body"
                    dangerouslySetInnerHTML={{ __html: readmeHtml }}
                  />
                }
              </TabContainer>
              <TabContainer>
                {data.package.lastRelease &&
                  <div className='markdown-body' style={{ paddingBottom: 0 }}>
                    <Typography
                      style={{ marginBottom: "10px" }}
                      type="display1"
                      component="h2"
                    >
                      {data.package.lastRelease.name}
                    </Typography>
                    <Typography
                      type="body1"
                      component="p"
                    >
                      Published:{" "}
                      {moment(data.package.lastRelease.publishedAt).format(
                        "MMMM Do, YYYY"
                      )}
                    </Typography>
                  </div>}
                <div
                  className="markdown-body"
                  dangerouslySetInnerHTML={{ __html: changelogHtml }}
                />
              </TabContainer>

              {/* Recommendations */}
              <TabContainer>
                <Grid container style={{ padding: '0 10px' }}>
                  {this._renderRecommendations()}
                </Grid>
              </TabContainer>

              <TabContainer>
                <div style={{ position: 'relative', width: '100%', height: '450px' }}>
                  <h4 
                    style={{ 
                      position: 'absolute',
                      zIndex: 1,
                      right: '60px',
                      borderRadius: '2px',
                      padding: '10px',
                      background: 'rgba(0, 0, 0, .5)',
                      color: 'white'
                    }}
                  >
                    Coming Soon
                  </h4>
                  {
                    this.state.index === 3 &&
                    <ResponsiveContainer>
                      <LineChart 
                        data={this.props.packageHistory}
                        margin={{top: 5, right: 30, left: 20, bottom: 5}}
                      >
                        <XAxis dataKey="month"/>
                        <YAxis label={{ value: 'Percentage of Users', angle: -90, dx: -20 }} />
                        <CartesianGrid strokeDasharray="3 3"/>
                        <Tooltip/>
                        <Legend verticalAlign='bottom' />
                        <Line type="monotone" dataKey="backlog" stroke="#2196F3" activeDot={{r: 6}}/>
                        <Line type="monotone" dataKey="trial" stroke="lightseagreen" activeDot={{r: 6}} />
                        <Line type="monotone" dataKey="production" stroke="#4CAF50" activeDot={{r: 6}} />
                        <Line type="monotone" dataKey="archive" stroke="#F44336" activeDot={{r: 6}} />
                      </LineChart>
                    </ResponsiveContainer>
                  }
                </div>
              </TabContainer>
            </SwipeableViews>
          </Grid>
        </Grid>

        {/* Add Package */}
        {
          currentUser &&
            <Dialog
              open={this.state.isAddPackageModalOpen}
              onRequestClose={this._closePackageModal}
            >
              <DialogTitle>Add Package</DialogTitle>
              <DialogContent 
                style={{ 
                  width: "550px", 
                  marginBottom: "30px",
                  overflowY: 'inherit'
                }}
              >
                <Select
                  options={this._formatBoardSelectItems()}
                  placeholder="Select Board"
                  value={this.state.selectedBoard}
                  onChange={this._handleBoardSelection}
                  autofocus
                  style={{ marginBottom: "20px" }}
                />
                <Select
                  options={this.props.kanbanStatusOptions}
                  placeholder="Select Status"
                  value={this.state.selectedStatus}
                  onChange={this._handleStatusSelection}
                  style={{ marginBottom: "20px" }}
                />
              </DialogContent>
              <DialogActions>
                <Button className="mr3" onClick={this._closePackageModal}>
                  Cancel
                </Button>
                <Button
                  raised
                  color="primary"
                  disabled={
                    !this.state.selectedStatus || 
                      !this.state.selectedBoard ||
                        this.state.isAddPackageLoading
                  }
                  onClick={this._handleAddPackage}
                >
                  {
                    this.state.isAddPackageLoading &&
                    <i className="fa fa-circle-o-notch fa-spin mr2"></i>
                  }
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
        }
      </div>
    );
  }
}

const packageOptions = {
  options: props => {
    return {
      variables: {
        ownerName: props.match.params.owner,
        packageName: props.match.params.package
      }
    };
  }
};

export default compose(
  graphql(CREATE_USER_KANBAN_PACKAGE, { name: 'createUserKanbanPackage' }),
  graphql(UPDATE_KANBAN_CARDS, { name: "updateKanbanCards" }),
  graphql(GET_PACKAGE, packageOptions),
)(PackageDetail);
