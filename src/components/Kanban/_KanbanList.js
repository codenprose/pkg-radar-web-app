import React, { Component } from "react";
import styled from 'styled-components'
import { DropTarget } from 'react-dnd';
import ReactTooltip from 'react-tooltip'

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
  margin: 0 0 15px 0;
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

  _renderHelpText = () => {
    const { currentBoard, color, helpText, id, title} = this.props
    let tooltipPosition = 'bottom'
    let tooltipId = `${currentBoard}-${id}`
    if (title === 'Archive') tooltipPosition = 'left'

    if (this.props.currentBoard === 'All') {
      return (
        <div style={{ float: 'right' }}>
          <i 
            className="fa fa-question-circle-o" 
            aria-hidden="true"
            style={{ color: color }}
            data-tip={helpText}
            data-for={tooltipId}
          />
          <ReactTooltip id={tooltipId} place={tooltipPosition} />
        </div>
      )
    }
  }

  render() {
    const { connectDropTarget, title } = this.props

    return connectDropTarget(
      <div>
        <KanbanListContainer>
          <KanbanListTitle>
            {title}
            {this._renderHelpText()}
          </KanbanListTitle>
          {this._renderCards()}
        </KanbanListContainer>
      </div>
    );
  }
}

export default DropTarget(constants.CARD, listTargetSpec, collect)(KanbanList);
