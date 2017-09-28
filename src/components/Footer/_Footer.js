import React, { Component } from 'react'
// import { Link } from 'react-router-dom'
import Typography from 'material-ui/Typography';

class Footer extends Component {
  render() {
    const styles = {
      containerOuter: {
        background: '#F7F7F7',
        position: 'fixed',
        bottom: 0,
        width: '100%'
      },
      containerInner: {
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '15px 20px',
        textAlign: 'right'
      }
    }
    return (
      <footer style={styles.containerOuter}>
        <div style={styles.containerInner}>
          <Typography 
            type="subheading"
            style={{
              display: 'inline-block',
              marginRight: '10px',
              verticalAlign: 'middle'
            }}
          >
            Made in Philly by
          </Typography>
          <a 
            href="https://twitter.com/danielkhunter" 
            className="twitter-follow-button no-underline"
            target='_blank'
            rel="noopener noreferrer"
          >
            @danielkhunter
          </a>
          {/* <Link className='no-underline black mr4' to='/'>About</Link>
          <Link className='no-underline black mr4' to='/'>Boards</Link> */}
        </div>
      </footer>
    )
  }
}

export default Footer