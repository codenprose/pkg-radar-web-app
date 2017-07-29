import React, { Component } from "react";
import Card, { CardHeader, CardContent, CardActions } from "material-ui/Card";
import Button from "material-ui/Button";
import { Link } from "react-router-dom";
import StarsIcon from "material-ui-icons/Stars";
import ErrorOutlineIcon from "material-ui-icons/ErrorOutline";
import Humanize from "humanize-plus";

class PackageCard extends Component {
  render() {
    const { avatar, name, primaryLanguage, issues, stars } = this.props.pkg;

    const styles = {
      root: {
        boxShadow: "5px 5px 25px 0px rgba(46,61,73,0.2)"
      },
      header: {
        paddingBottom: '10px'
      },
      content: {
        padding: '10px 16px 0'
      }
    };

    return (
      <Card style={styles.root}>
        <CardHeader
          style={styles.header}
          avatar={
            <img
              alt={`${name}-logo`}
              style={{ height: "42px" }}
              src={avatar}
            />
          }
          title={<span style={{ fontSize: '20px' }}>{name}</span>}
          subheader={
            <div>
              <div
                style={{
                  display: "inline-block",
                  width: "15px",
                  height: "15px",
                  marginRight: "5px",
                  borderRadius: "50%",
                  verticalAlign: "sub",
                  backgroundColor: `${primaryLanguage.color}`
                }}
              />
              <span>{primaryLanguage.name}</span>
            </div>
          }
        />
        <CardContent style={styles.content}>
          <div className="mb1 mr2 dib">
            <StarsIcon
              style={{
                verticalAlign: "sub",
                height: "18px",
                width: "18px",
                marginRight: "5px"
              }}
            />
            <span>{Humanize.formatNumber(stars)}</span>
          </div>
          <div className="dib">
            <ErrorOutlineIcon
              style={{
                verticalAlign: "sub",
                height: "18px",
                width: "18px",
                marginRight: "5px"
              }}
            />
            <span>{Humanize.formatNumber(issues)}</span>
          </div>
        </CardContent>
        <CardActions>
          <Link className="no-underline" to={`/package/${name}`}>
            <Button dense>View Package</Button>
          </Link>
        </CardActions>
      </Card>
    );
  }
}

export default PackageCard;
