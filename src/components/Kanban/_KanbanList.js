import React, { Component } from "react";
import styled from 'styled-components'

import KanbanCard from "./_KanbanCard";

const KanbanListContainer = styled.div`
  padding: 10px;
  background-color: #EEEEEE;
`

const KanbanListTitle = styled.h3`
  font-size: 20px;
  font-weight: 200;
  margin: 0 0 10px 0;
`

class KanbanList extends Component {
  _renderCards() {
    return this.props.cards.map(card => {
      return (
        <KanbanCard
          key={card.id}
          id={card.id}
          name={card.name}
          description={card.description}
          avatar={card.avatar}
          stars={card.stars}
        />
      );
    });
  }

  render() {
    return (
      <KanbanListContainer>
        <KanbanListTitle>
          {this.props.title}
        </KanbanListTitle>
        {this._renderCards()}
      </KanbanListContainer>
    );
  }
}
export default KanbanList;
