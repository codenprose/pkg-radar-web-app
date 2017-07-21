import React, { Component } from "react";
import Grid from "material-ui/Grid";
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import KanbanList from "./_KanbanList";

class KanbanBoard extends Component {
  render() {
    const { cards, cardCallbacks } = this.props;

    return (
      <Grid container>
        <Grid item xs={3}>
          <KanbanList
            id="backlog"
            title="Backlog"
            cards={cards.filter(card => card.list === "backlog")}
            cardCallbacks={cardCallbacks}
          />
        </Grid>
        <Grid item xs={3}>
          <KanbanList
            id="staging"
            title="Staging"
            cards={cards.filter(card => card.list === "staging")}
            cardCallbacks={cardCallbacks}
          />
        </Grid>
        <Grid item xs={3}>
          <KanbanList
            id="production"
            title="Production"
            cards={cards.filter(card => card.list === "production")}
            cardCallbacks={cardCallbacks}
          />
        </Grid>
        <Grid item xs={3}>
          <KanbanList
            id="archive"
            title="Archive"
            cards={cards.filter(card => card.list === "archive")}
            cardCallbacks={cardCallbacks}
          />
        </Grid>
      </Grid>
    );
  }
}

export default DragDropContext(HTML5Backend)(KanbanBoard);
