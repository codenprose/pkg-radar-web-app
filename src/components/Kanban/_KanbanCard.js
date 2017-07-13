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
import { withStyles, createStyleSheet } from 'material-ui/styles';
import { Link } from 'react-router-dom'

const styleSheet = createStyleSheet('KanbanCard', theme => ({
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
}));

const cardDragSpec = {
  beginDrag(props) {
    return {
      id: props.id,
      status: props.status
    };
  },
  endDrag(props) {
    props.cardCallbacks.persistCardDrag();
  }
};

const cardDropSpec = {
  hover(props, monitor) {
    const draggedId = monitor.getItem().id;
    props.cardCallbacks.updatePosition(draggedId, props.id);
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
      name,
      stars,
      description,
      avatar,
      connectDragSource,
      connectDropTarget,
      classes
    } = this.props;

    return connectDropTarget(
      connectDragSource(
        <div>
          <KanbanCardContainer>
            <Card>
              <CardHeader
                title={name}
                subheader={`stars: ${Humanize.formatNumber(stars)}`}
                avatar={
                  <img
                    alt={`${name}-logo`}
                    style={{ height: "40px" }}
                    src={avatar}
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
                <Link to={`/package/${name}`} className='no-underline'>
                  <Button dense>View Package</Button>
                </Link>
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

export default  withStyles(styleSheet)(dragDropHighOrderCard);
