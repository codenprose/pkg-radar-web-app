import React, { Component } from 'react'
import styled from 'styled-components'

import constructionImg from "../../images/christopher_burns.jpg"

const BackgroundImage = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 600px;
  background: url('${constructionImg}') no-repeat bottom;
  background-size: cover;

  &:after {
    content: "";
    position: absolute;
    z-index: -2;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(0, 0, 0, .4), rgba(0, 0, 0, .4));
  }
`

class Discovery extends Component {
  render() {
    return (
      <BackgroundImage />
    )
  }
}

export default Discovery