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
import TextField from "material-ui/TextField";
import moment from "moment";
import Select from 'react-select';
import find from 'lodash/find'

import { Loader } from '../Shared'

import CURRENT_USER from '../../queries/currentUser'
import GET_PACKAGE from '../../queries/package'
import USER_KANBAN_PACKAGES from '../../queries/userKanbanPackages'
import UPDATE_KANBAN_CARD_POSITIONS from '../../mutations/updateKanbanCardPositions';
import CREATE_USER_KANBAN_PACKAGE from '../../mutations/createUserKanbanPackage'

import "github-markdown-css/github-markdown.css";

const rst2mdown = require('rst2mdown');
const Text = require('react-format-text');

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
      { label: 'backlog', value: 'backlog' },
      { label: 'trial', value: 'trial' },
      { label: 'production', value: 'production' },
      { label: 'archive', value: 'archive' }
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
    this.setState({ selectedBoard: option.value });
  };

  _handleStatusSelection = option => {
    this.setState({ selectedStatus: option.value });
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

  render() {
    const { currentUser, data, isUserLoading } = this.props;
    if (data.loading || isUserLoading) return <Loader />
    console.log('props', this.props)
    // console.log('current user', currentUser)

    let isPackageSaved = this._checkIfPackageIsSaved()
    let addPackageBtnText = 'Add To Radar'
    let addPackageBtnColor = 'black'
    let addPackageBtnBgColor = 'white'

    if (isPackageSaved) {
      addPackageBtnText = 'Saved'
      addPackageBtnColor = 'white'
      addPackageBtnBgColor = '#009688'
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

            {/* Package Info / Stats */}
            <Card style={styles.card}>
              <CardHeader
                avatar={
                  <img
                    alt={`${data.package.packageName}-logo`}
                    style={{ height: "42px" }}
                    src={data.package.ownerAvatar}
                  />
                }
                title={`${data.package.ownerName}/${data.package.packageName}`}
                subheader={
                  <div>
                    <div 
                      style={{ 
                        display: 'inline-block', 
                        width: '15px', 
                        height: '15px', 
                        marginRight: '5px', 
                        borderRadius: '50%',
                        verticalAlign: 'sub', 
                        backgroundColor: data.package.color
                      }}
                    />
                    <span>{data.package.language}</span>
                  </div>
                }
              />
              <CardContent style={{ padding: '0 16px' }}>
                <ul className='list pl0 dib mr4 mt0 mb0'>
                  <li>{Humanize.formatNumber(data.package.stars)} Stars</li>
                  <li>{Humanize.formatNumber(data.package.issues)} Issues</li>
                  <li>{Humanize.formatNumber(data.package.commits.total)} Commits</li>
                  <li>{Humanize.formatNumber(data.package.releases)} Releases</li>
                </ul>
                <ul className='list pl0 dib mt0 mb0'>
                  <li>{Humanize.formatNumber(data.package.contributors.total)} Contributors</li>
                  <li>{Humanize.formatNumber(data.package.watchers)} Watchers</li>
                  <li>{Humanize.formatNumber(data.package.pullRequests)} Pull Requests</li>
                  <li>{Humanize.formatNumber(data.package.forks)} Forks</li>
                </ul>
              </CardContent>
              <CardActions>
                {data.package.websiteUrl &&
                  <Link
                    to={data.package.websiteUrl}
                    target="_blank"
                    className="no-underline"
                  >
                    <Button dense>Website</Button>
                  </Link>}
                <Link
                  to={data.package.repoUrl}
                  target="_blank"
                  className="no-underline"
                >
                  <Button dense>Repo</Button>
                </Link>
              </CardActions>
            </Card>

            {/* Tags */}
            {/* <Card style={styles.card}>
              <CardContent style={{ paddingBottom: 0 }}>
                <Typography type="title" component="h2">
                  Tags
                </Typography>
                <div style={{ marginTop: '20px' }}>
                  {
                    data.package.tags.length &&
                    data.package.tags.map((tag, i) => {
                      return (
                        <Link to={`/search?=${tag}`} key={i}>
                          <Chip
                            label={tag}
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
            </Card> */}

            {/* Last Commit */}
            <Card style={styles.card}>
              <CardContent style={{ paddingBottom: 0 }}>
                <Typography style={{ marginBottom: '20px '}} type="title" component="h2">
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
                >
                  <Button dense>View Commit</Button>
                </Link>
              </CardActions>
            </Card>

            {/* Contributors */}
            <Card style={styles.card}>
              <CardContent>
                <Typography style={{ marginBottom: '20px '}} type="title" component="h2">
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
            </Card>

            {/* License */}
            <Card style={styles.card}>
              <CardContent>
                <Typography type="title" component="h2">
                  License
                </Typography>
                <Typography type="body1">
                  {data.package.license}
                </Typography>
              </CardContent>
              <CardActions>
                <Button dense>View License</Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Tabs */}
          <Grid item xs={9} style={{ paddingLeft: '20px' }}>
            <Grid container>
              <Grid style={{ paddingTop: 0 }} item xs={9}>
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
                  <Tab label="History" />
                </Tabs>
              </Grid>
              <Grid item xs={3}>
                <Button 
                  raised
                  disabled={isPackageSaved}
                  onClick={this._openPackageModal}
                  style={{ 
                    color: addPackageBtnColor,
                    backgroundColor: addPackageBtnBgColor,
                    marginRight: "10px" 
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

              {/* <TabContainer>
                {"Analytics"}
              </TabContainer> */}
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
