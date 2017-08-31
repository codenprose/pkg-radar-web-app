import React, { Component } from "react";
import styled from 'styled-components'
import { DropTarget } from 'react-dnd';

import constants from '../../constants';
import KanbanCard from "./_KanbanCard";

const KanbanListContainer = styled.div`
  padding: 10px;
  background-color: #ECEFF1;
  min-height: 195px;
`

const KanbanListTitle = styled.h3`
  font-size: 20px;
  font-weight: 200;
  margin: 0 0 10px 0;
`

const listTargetSpec = {
  hover(props, monitor) {
    if (!props.userIsCurrentUser) return null
    const draggedId = monitor.getItem().packageId;
    props.cardCallbacks.updateStatus(draggedId, props.id)
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget()
  };
}

class KanbanList extends Component {
  _renderCards() {
    const { cards, cardCallbacks, currentBoard, userIsCurrentUser } = this.props

    return cards.map(card => {
      return (
        <KanbanCard
          key={card.packageId}
          cardCallbacks={cardCallbacks}
          currentBoard={currentBoard}
          userIsCurrentUser={userIsCurrentUser}
          {...card}
        />
      );
    });
  }

  render() {
    const { connectDropTarget } = this.props

    return connectDropTarget(
      <div>
        <KanbanListContainer>
          <KanbanListTitle>
            {this.props.title}
          </KanbanListTitle>
          {this._renderCards()}
        </KanbanListContainer>
      </div>
    );
  }
}

export default DropTarget(constants.CARD, listTargetSpec, collect)(KanbanList);
