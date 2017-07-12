import React, { Component } from "react";
import styled from 'styled-components'
import { DropTarget } from 'react-dnd';

import constants from '../../constants';
import KanbanCard from "./_KanbanCard";

const KanbanListContainer = styled.div`
  padding: 10px;
  background-color: #EEEEEE;
  min-height: 195px;
`

const KanbanListTitle = styled.h3`
  font-size: 20px;
  font-weight: 200;
  margin: 0 0 10px 0;
`

const listTargetSpec = {
  hover(props, monitor) {
    const draggedId = monitor.getItem().id;
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
    const { cards, cardCallbacks } = this.props

    return cards.map(card => {
      return (
        <KanbanCard
          key={card.id}
          id={card.id}
          name={card.name}
          description={card.description}
          avatar={card.avatar}
          stars={card.stars}
          cardCallbacks={cardCallbacks}
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
