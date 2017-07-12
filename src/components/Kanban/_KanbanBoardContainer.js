import React, { Component } from "react";
import update from "immutability-helper";
import throttle from 'lodash/throttle'

import KanbanBoard from "./_KanbanBoard";

class KanbanBoardContainer extends Component {
  state = {
    cards: this.props.cards
  };

  updateCardStatus = (cardId, listId) => {
    // Find the index of the card
    let cardIndex = this.state.cards.findIndex((card) => card.id === cardId);
    // Get the current card
    let card = this.state.cards[cardIndex]
    // Only proceed if hovering over a different list
    if(card.status !== listId){
      // set the component state to the mutated object
      this.setState(update(this.state, {
          cards: {
            [cardIndex]: {
              status: { $set: listId }
            }
          }
      }));
    }
  }

  updateCardPosition = (cardId, afterId) => {
    // Only proceed if hovering over a different card
    if (cardId !== afterId) {
      // Find the index of the card
      let cardIndex = this.state.cards.findIndex(card => card.id === cardId);
      // Get the current card
      let card = this.state.cards[cardIndex];
      // Find the index of the card the user is hovering over
      let afterIndex = this.state.cards.findIndex(card => card.id === afterId);
      // Use splice to remove the card and reinsert it a the new index
      this.setState(
        update(this.state, {
          cards: {
            $splice: [[cardIndex, 1], [afterIndex, 0, card]]
          }
        })
      );
    }
  }

  render() {
    return (
      <KanbanBoard
        cards={this.state.cards}
        cardCallbacks={{
          updateStatus: throttle(this.updateCardStatus),
          updatePosition: throttle(this.updateCardPosition, 500)
        }}
      />
    );
  }
}

export default KanbanBoardContainer;
