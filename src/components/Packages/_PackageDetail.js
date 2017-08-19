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
import Chip from "material-ui/Chip";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from "material-ui/Dialog";
import TextField from "material-ui/TextField";
import moment from "moment";

import { Loader } from '../Shared'
import GET_PACKAGE from '../../queries/package'

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
    isModalOpen: false,
    recommendationSearch: "",
    recommendationSelection: {}
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

  render() {
    const { data, history } = this.props;
    console.log(data)

    if (data.loading) return <Loader />

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
        marginBottom: "15px",
        // boxShadow: "5px 5px 25px 0px rgba(46,61,73,0.2)"
      }
    };

    return (
      <div>
        <Grid container>
          <Grid item xs={3}>

            {/* Package Title */}
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
                subheader={data.package.language}
              />
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
            <Card style={styles.card}>
              <CardContent style={{ paddingBottom: 0 }}>
                <Typography type="title" component="h2">
                  Tags
                </Typography>
                <div style={{ marginTop: '20px' }}>
                  {
                    data.package.tags.length &&
                    data.package.tags.map(({tagName}, i) => {
                      return (
                        <Link to={`/search?=${tagName}`} key={i}>
                          <Chip
                            label={tagName}
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
                  onClick={() => {
                      const owner = data.package.ownerName
                      const pkg = data.package.packageName
                      history.push(`/package/update/${owner}/${pkg}`)
                    }
                  }
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

            {/* Package Stars */}
            <Card style={styles.card}>
              <CardContent>
                <Typography type="title" component="h2">
                  Stars
                </Typography>
                <Typography type="body1">
                  {Humanize.formatNumber(data.package.stars)}
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
                  {Humanize.formatNumber(data.package.issues)}
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
                  {Humanize.formatNumber(data.package.issues / data.package.stars * 100)}%
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
                  {Humanize.formatNumber(data.package.pullRequests)}
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
                <Typography type="body1">Add Contributors</Typography>
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
                  {/* <Tab label="Analytics" /> */}
                </Tabs>
              </Grid>
              <Grid item xs={3}>
                <Button raised style={{ marginRight: "10px" }}>
                  Add To Radar
                </Button>
                {/* <Button raised>Monitor</Button> */}
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
                  <div className='tc'>
                    <Typography
                      style={{ marginBottom: "10px" }}
                      type="display1"
                      component="h2"
                    >
                      v{data.package.lastRelease.name}
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
  graphql(GET_PACKAGE, packageOptions),
)(PackageDetail);
