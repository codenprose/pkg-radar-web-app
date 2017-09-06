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
import TextField from "material-ui/TextField";
import moment from "moment";
import Select from 'react-select';
import find from 'lodash/find'
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts'

import { Loader } from '../Shared'

import CURRENT_USER from '../../queries/currentUser'
import GET_PACKAGE from '../../queries/package'
import USER_KANBAN_PACKAGES from '../../queries/userKanbanPackages'
import UPDATE_KANBAN_CARD_POSITIONS from '../../mutations/updateKanbanCardPositions';
import CREATE_USER_KANBAN_PACKAGE from '../../mutations/createUserKanbanPackage'

import radarBgImg from "../../images/nathan_anderson_radar.jpg"

import "github-markdown-css/github-markdown.css";

const rst2mdown = require('rst2mdown');
const Text = require('react-format-text');

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
  <div style={{ marginTop: "20px" }}>
    {props.children}
  </div>;

class PackageDetail extends Component {
  state = {
    index: 0,
    isAddPackageModalOpen: false,
    isModalOpen: false,
    isAddPackageLoading: false,
    recommendationSearch: "",
    recommendationSelection: {},
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
      { month: 'June', backlog: 26, trial: 14, production: 51, archive: 9 },
      { month: 'July', backlog: 26, trial: 14, production: 51, archive: 9 },
      { month: 'August', backlog: 26, trial: 14, production: 51, archive: 9 },
    ]
  }

  _formatKanbanCardPositions = () => {
    const kanbanCardPositions = this.props.currentUser.kanbanCardPositions
    let cards = []

    for (let item in kanbanCardPositions) {
      const card = kanbanCardPositions[item]
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

      console.log('updating card positions')
      const token = localStorage.getItem('pkgRadarToken')
      const kanbanCardPositions = this._formatKanbanCardPositions()
      const card = { 
        board: selectedBoard, 
        ownerName: data.package.ownerName,
        packageName: data.package.packageName,
      }

      await this.props.updateKanbanCardPositions({
        variables: { 
          username: currentUser.username, 
          kanbanCardPositions: [...kanbanCardPositions, card]
        },
        refetchQueries: [{
          query: CURRENT_USER,
          variables: { username: currentUser.username, token }
        }]
      });
      console.log('updated card positions')
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
    this.setState({ index });
  };

  handleMainContentChangeIndex = index => {
    this.setState({ index });
  };

  _handleModalOpen = () => {
    this.setState({ isModalOpen: true });
  };

  _handleModalClose = () => {
    this.setState({ isModalOpen: false });
  };

  _handleRecommendationSearch = pkg => {
    this.setState({ recommendationSearch: pkg });
  };

  _handleAddRecommendation = () => {
    // TODO: check if recommendation already exists
    const variables = {
      recommendations: [
        ...this.props.data.package.recommendations,
        this.state.recommendationSelection
      ]
    };

    console.log("adding recommendation");

    this.props
      .updatePackageRecommendations({ variables })
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        console.error("error creating package", err.message);
      });
  };

  _renderRecommendations = () => {
    const { data } = this.props;
    return data.package.recommendations.map(
      ({ name, avatar, stars, description }) => {
        return (
          <Grid item xs={4} key={name}>
            <Card
              style={{
                marginBottom: "15px",
                boxShadow: "5px 5px 25px 0px rgba(46,61,73,0.2)"
              }}
            >
              <CardHeader
                avatar={
                  <img
                    alt={`${name}-logo`}
                    style={{ height: "40px" }}
                    src={avatar}
                  />
                }
                title={name}
                subheader={`Stars: ${stars}`}
              />
              <CardContent style={{ padding: "0 16px" }}>
                <Typography type="body1" component="p">
                  {description}
                </Typography>
              </CardContent>
              <CardActions>
                <Link to={`/package/${name}`} className="no-underline">
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
    
    const saved = find(currentUser.kanbanCardPositions, (card) => {
      return card.ownerName === data.package.ownerName &&
        card.packageName === data.package.packageName
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
    if (data.loading || isUserLoading) return <Loader />
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
                  <div className='mb2'>
                    <img
                      alt={`${data.package.packageName}-logo`}
                      style={{ 
                        height: "50px", 
                        marginRight: '20px',
                        borderRadius: '50%'
                      }}
                      src={data.package.ownerAvatar}
                    />
                    <Typography 
                      type="headline" 
                      gutterBottom
                      style={{ color: 'white', display: 'inline-block' }}
                    >
                    {data.package.ownerName} / {data.package.packageName}
                    <div style={{ fontSize: '16px' }}>
                      {data.package.description}
                    </div>
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={12} style={{ paddingTop: 0 }}>
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
              onChangeIndex={this.handleMainContentChangeIndex}
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
                <Grid container>
                  {
                    data.package.recommendations &&
                    this._renderRecommendations()
                  }

                  {/* Add Recommendation */}
                  <Grid item xs={4}>
                    <Grid
                      container
                      align="center"
                      justify="center"
                      style={{ height: "100%" }}
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

              <TabContainer>
                <div style={{ width: '100%', height: '450px' }}>
                  {/* <Typography
                    style={{ marginBottom: "10px", textAlign: 'center' }}
                    type="title"
                  >
                    User Adoption Percentages
                  </Typography> */}
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
                        <Legend verticalAlign='bottom' wrapperStyle={{ bottom: '-10px' }} />
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
              <DialogContent style={{ width: "550px", marginBottom: "30px" }}>
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
                <Button className="mr3" onTouchTap={this._closePackageModal}>
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
                  onTouchTap={this._handleAddPackage}
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
        
        {/* Recommendation */}
        <Dialog
          style={{ width: "100%" }}
          open={this.state.isModalOpen}
          onRequestClose={this._handleModalClose}
        >
          <DialogTitle>Add New Package</DialogTitle>
          <DialogContent style={{ width: "500px" }}>
            <TextField
              autoFocus
              style={{ width: "100%" }}
              value={this.state.recommendationSearch}
              placeholder="Search for Package"
              onChange={e => this._handleRecommendationSearch(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button className="mr3" onTouchTap={this._handleModalClose}>
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
  graphql(UPDATE_KANBAN_CARD_POSITIONS, { name: "updateKanbanCardPositions" }),
  graphql(GET_PACKAGE, packageOptions),
)(PackageDetail);
