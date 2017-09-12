import React, { Component } from "react";
import Grid from "material-ui/Grid";
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import KanbanList from "./_KanbanList";

class KanbanBoard extends Component {
  static defaultProps = {
    helpText: {
      backlog: "I've heard of them, but haven't played yet.",
      trial: "Taking them for a spin.",
      production: "Currently using in a Production environment.",
      archive: "Been there. Done that. Moved on."
    }
  }

  render() {
    const { cards, cardCallbacks, currentBoard, helpText, userIsCurrentUser } = this.props

    return (
      <Grid container>
        <Grid item xs={3}>
          <KanbanList
            id="backlog"
            title="Backlog"
            color='#2196F3'
            cards={cards.filter(card => card.status === "backlog")}
            cardCallbacks={cardCallbacks}
            currentBoard={currentBoard}
            helpText={helpText.backlog}
            userIsCurrentUser={userIsCurrentUser}
          />
        </Grid>
        <Grid item xs={3}>
          <KanbanList
            id="trial"
            title="Trial"
            color='lightseagreen'
            cards={cards.filter(card => card.status === "trial")}
            cardCallbacks={cardCallbacks}
            currentBoard={currentBoard}
            helpText={helpText.trial}
            userIsCurrentUser={userIsCurrentUser}
          />
        </Grid>
        <Grid item xs={3}>
          <KanbanList
            id="production"
            title="Production"
            color='#4CAF50'
            cards={cards.filter(card => card.status === "production")}
            cardCallbacks={cardCallbacks}
            currentBoard={currentBoard}
            helpText={helpText.production}
            userIsCurrentUser={userIsCurrentUser}
          />
        </Grid>
        <Grid item xs={3}>
          <KanbanList
            id="archive"
            title="Archive"
            color='#F44336'
            cards={cards.filter(card => card.status === "archive")}
            cardCallbacks={cardCallbacks}
            currentBoard={currentBoard}
            helpText={helpText.archive}
            userIsCurrentUser={userIsCurrentUser}
          />
        </Grid>
      </Grid>
    );
  }
}

export default DragDropContext(HTML5Backend)(KanbanBoard);
