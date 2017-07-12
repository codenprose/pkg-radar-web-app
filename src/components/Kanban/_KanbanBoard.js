import React, { Component } from "react";
import Grid from "material-ui/Grid";

import KanbanList from "./_KanbanList";

class KanbanBoard extends Component {
  render() {
    const { cards } = this.props;

    return (
      <Grid container>
        <Grid item xs={3}>
          <KanbanList
            id="backlog"
            title="Backlog"
            cards={cards.filter(card => card.status === "backlog")}
          />
        </Grid>
        <Grid item xs={3}>
          <KanbanList
            id="staging"
            title="Staging"
            cards={cards.filter(card => card.status === "staging")}
          />
        </Grid>
        <Grid item xs={3}>
          <KanbanList
            id="production"
            title="Production"
            cards={cards.filter(card => card.status === "production")}
          />
        </Grid>
        <Grid item xs={3}>
          <KanbanList
            id="archive"
            title="Archive"
            cards={cards.filter(card => card.status === "archive")}
          />
        </Grid>
      </Grid>
    );
  }
}
export default KanbanBoard;
