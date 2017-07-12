import React, { Component } from "react";
import Card, { CardHeader, CardActions, CardContent } from "material-ui/Card";
import Typography from "material-ui/Typography";
import Button from "material-ui/Button";

class KanbanCard extends Component {
  state = {
    isContentVisible: false
  }

  render() {
    const { name, stars, description, avatar } = this.props;

    return (
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
    );
  }
}
export default KanbanCard;
