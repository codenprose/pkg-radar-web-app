import React, { Component } from 'react';
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card';
import Button from 'material-ui/Button';
import { Link } from 'react-router-dom';
import StarsIcon from 'material-ui-icons/Stars';
import ErrorOutlineIcon from 'material-ui-icons/ErrorOutline';
import Humanize from "humanize-plus";
import Chip from 'material-ui/Chip';

class PackageCard extends Component {
  render() {
    const { avatar, name, primaryLanguage, issues, stars } = this.props.pkg;

    const styles = {
      card: {
        position: 'relative',
        minHeight: '200px',
        boxShadow: '5px 5px 25px 0px rgba(46,61,73,0.2)'
      },
      cardActions: {
        position: 'absolute',
        bottom: 0
      }
    }

    return (
      <Card style={styles.card}>
        <CardHeader 
          title={name}
          subheader={
            <div>
              <div 
                style={{ 
                  display: 'inline-block',
                  width: '15px',
                  height: '15px',
                  marginRight: '5px',
                  borderRadius: '50%',
                  verticalAlign: 'sub',
                  backgroundColor: `${primaryLanguage.color}` 
                }} 
              />
              <span>{primaryLanguage.name}</span>
            </div>
          }
        />
        <img
          alt={`${name}-logo`}
          style={{
            position: 'absolute',
            top: '80px',
            right: 0,
            height: '50px'
          }}
          src={avatar}
        />
        <CardContent style={{ paddingTop: 0 }}>
          <div className='mb1 mr2'>
            <StarsIcon 
              style={{ 
                verticalAlign: 'sub',
                height: '18px',
                width: '18px',
                marginRight: '7px'
              }} 
            />
            <span>{Humanize.formatNumber(stars)}</span>
          </div>
          <div>
            <ErrorOutlineIcon 
              style={{ 
                verticalAlign: 'sub',
                height: '18px',
                width: '18px',
                marginRight: '7px'
              }} 
            />
            <span>{Humanize.formatNumber(issues)}</span>
          </div>
        </CardContent>
        <CardActions style={styles.cardActions}>
          <Link 
            className='no-underline' 
            to={`/package/${name}`}
          >
            <Button dense>
              View Package
            </Button>
          </Link>
        </CardActions>
      </Card>
    )
  }
}

export default PackageCard;