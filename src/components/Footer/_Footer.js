import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Footer extends Component {
  render() {
    const styles = {
      containerOuter: {
        background: '#CFD8DC',
        position: 'fixed',
        bottom: 0,
        width: '100%'
      },
      containerInner: {
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '15px 20px'
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