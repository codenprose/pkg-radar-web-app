import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Footer extends Component {
  render() {
    const styles = {
      containerOuter: {
        background: '#F2F2F2',
        padding: '15px 20px',
        position: 'absolute',
        bottom: 0,
        width: '100%'
      },
      containerInner: {
        maxWidth: '1600px',
        margin: '0 auto'
      }
    }
    return (
      <footer style={styles.containerOuter}>
        <div style={styles.containerInner}>
          <Link className='no-underline black mr4' to='/'>About</Link>
          <Link className='no-underline black mr4' to='/'>Boards</Link>
        </div>
      </footer>
    )
  }
}

export default Footer