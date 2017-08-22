import React, { Component } from "react";
import Card, { CardHeader, CardActions, CardContent } from "material-ui/Card";
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";
import IconButton from 'material-ui/IconButton';
import { DragSource, DropTarget } from "react-dnd";
import constants from "../../constants";
import styled from "styled-components";
import Humanize from "humanize-plus";
import ExpandMoreIcon from "material-ui-icons/ExpandMore";
import Collapse from "material-ui/transitions/Collapse";
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';
import { Link } from 'react-router-dom'

const styles = theme => ({
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  flexGrow: { flex: '1 1 auto' },
})

const cardDragSpec = {
  beginDrag(props) {
    return {
      packageId: props.packageId,
      status: props.status
    };
  },
  endDrag(props) {
    const { packageId} = props
    props.cardCallbacks.persistCardPositions()
    props.cardCallbacks.persistPackageStatus(packageId);
  }
};

const cardDropSpec = {
  hover(props, monitor) {
    const draggedId = monitor.getItem().packageId;
    props.cardCallbacks.updatePosition(draggedId, props.packageId);
  }
};

let collectDrag = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource()
  };
};

let collectDrop = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget()
  };
};

const KanbanCardContainer = styled.div`margin-bottom: 10px;`;

class KanbanCard extends Component {
  state = {
    isContentVisible: false
  };

  handleExpandClick = () => {
    this.setState({ isContentVisible: !this.state.isContentVisible });
  };

  render() {
    const {
      packageId,
      ownerName,
      packageName,
      status,
      stars,
      description,
      ownerAvatar,
      connectDragSource,
      connectDropTarget,
      classes,
      currentBoard
    } = this.props;

    const { removeCard } = this.props.cardCallbacks;

    const styles = {
      card: {
        boxShadow: '5px 5px 25px 0px rgba(46,61,73,0.2)',
      }
    }

    return connectDropTarget(
      connectDragSource(
        <div>
          <KanbanCardContainer>
            <Card style={styles.card}>
              <CardHeader
                title={packageName}
                style={{ paddingBottom: 0 }}
                subheader={`stars: ${Humanize.formatNumber(stars)}`}
                avatar={
                  <img
                    alt={`${packageName}-logo`}
                    style={{ height: "40px" }}
                    src={ownerAvatar}
                  />
                }
              />
              <Collapse
                in={this.state.isContentVisible}
                transitionDuration="auto"
                unmountOnExit
              >
                <CardContent>
                  <Typography component="p">
                    {description}
                  </Typography>
                </CardContent>
              </Collapse>
              <CardActions>
                <Link to={`/${ownerName}/${packageName}`} className='no-underline'>
                  <Button dense style={{ paddingLeft: 0 }}>View</Button>
                </Link>
                <Button dense onClick={() => removeCard(packageId, packageName, currentBoard, status, ownerName)}>Remove</Button>
                <div className={classes.flexGrow} />
                <IconButton
                  className={classNames(classes.expand, {
                    [classes.expandOpen]: this.state.isContentVisible,
                  })}
                  onClick={this.handleExpandClick}
                  aria-expanded={this.state.isContentVisible}
                  aria-label="Show more"
                >
                  <ExpandMoreIcon />
                </IconButton>
              </CardActions>
            </Card>
          </KanbanCardContainer>
        </div>
      )
    );
  }
}
const dragHighOrderCard = DragSource(constants.CARD, cardDragSpec, collectDrag)(
  KanbanCard
);
const dragDropHighOrderCard = DropTarget(
  constants.CARD,
  cardDropSpec,
  collectDrop
)(dragHighOrderCard);

export default withStyles(styles)(dragDropHighOrderCard);
