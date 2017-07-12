import React, { Component } from "react";
import Card, { CardHeader, CardActions, CardContent } from "material-ui/Card";
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";
import { DragSource, DropTarget } from 'react-dnd';
import constants from '../../constants';
import styled from 'styled-components'

const cardDragSpec = {
  beginDrag(props) {
    return {
      id: props.id,
      status: props.status
    };
  },
  endDrag(props) {
    console.log('end drag', props)
    // props.cardCallbacks.persistCardDrag(props.id, props.status);
  }
}

const cardDropSpec = {
  hover(props, monitor) {
    const draggedId = monitor.getItem().id;
    props.cardCallbacks.updatePosition(draggedId, props.id);
  }
}

let collectDrag = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource()
  };
}

let collectDrop = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
  };
}

const KanbanCardContainer = styled.div`
  margin-bottom: 10px;
`

class KanbanCard extends Component {
  state = {
    isContentVisible: false
  }

  render() {
    const { 
      name, 
      stars, 
      description, 
      avatar, 
      connectDragSource, 
      connectDropTarget 
    } = this.props;

    return connectDropTarget(connectDragSource(
      <div>
        <KanbanCardContainer>
          <Card>
            <CardHeader
              title={name}
              subheader={`stars: ${stars}`}
              avatar={
                <img alt={`${name}-logo`} style={{ height: "40px" }} src={avatar} />
              }
            />
            {
              this.state.isContentVisible &&
              <CardContent>
                <Typography component="p">
                  {description}
                </Typography>
              </CardContent>
            }
            <CardActions>
              <Button dense>View Package</Button>
            </CardActions>
          </Card>
        </KanbanCardContainer>
      </div>
    ));
  }
}
const dragHighOrderCard = DragSource(constants.CARD, cardDragSpec, collectDrag)(KanbanCard);
const dragDropHighOrderCard = DropTarget(constants.CARD, cardDropSpec, collectDrop)(dragHighOrderCard);
export default dragDropHighOrderCard
