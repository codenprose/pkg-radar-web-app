import React, { Component } from "react"
import { Link } from 'react-router-dom'

import Grid from "material-ui/Grid"
import Paper from 'material-ui/Paper'
import Button from "material-ui/Button"
import Typography from 'material-ui/Typography'

import javascriptIcon from "../../images/javascript.svg"
import pythonIcon from "../../images/python.svg"
import javaIcon from "../../images/java.svg"
import goIcon from "../../images/go.svg"
import swiftIcon from "../../images/swift.svg"
import haskellIcon from '../../images/haskell.png'
import scalaIcon from '../../images/scala.png'
import cIcon from "../../images/c.svg"
import cPlusPlusIcon from "../../images/cPlusPlus.svg"
import cSharpIcon from "../../images/cSharp.svg"
import rubyIcon from "../../images/ruby.svg"
import phpIcon from "../../images/php.svg"

const Language = ({ icon, name, tag }) => {
  return (
    <Grid item xs={3}>
      <Paper elevation={2} style={{ padding: '20px' }}>
        <div className='tc'>
          <img
            className='db mb4'
            src={icon}
            alt={tag}
            height='70'
            style={{ margin: '0 auto 20px'}}
          />
          <Typography type="title" style={{ marginBottom: '20px' }}>
            {name}
          </Typography>
          <Link
            className='no-underline'
            to={`/search?q=${tag}`}
          >
            <Button raised>
              View
            </Button>
          </Link>
        </div>
      </Paper>
    </Grid>
  )
}

class Languages extends Component {
  render() {
    return (
      <div>
        <Grid container>

          <Language 
            icon={javascriptIcon}
            name='JavaScript'
            tag='javascript'
          />

          <Language 
            icon={pythonIcon}
            name='Python'
            tag='python'
          />

          <Language 
            icon={javaIcon}
            name='Java'
            tag='java'
          />

          <Language 
            icon={goIcon}
            name='Go'
            tag='go'
          />

          <Language 
            icon={swiftIcon}
            name='Swift'
            tag='swift'
          />

          <Language 
            icon={cIcon}
            name='C'
            tag='c'
          />

          <Language 
            icon={cPlusPlusIcon}
            name='C++'
            tag='c-plus-plus'
          />
          
          <Language 
            icon={cSharpIcon}
            name='C#'
            tag='c-sharp'
          />

          <Language 
            icon={scalaIcon}
            name='Scala'
            tag='scala'
          />

          <Language 
            icon={haskellIcon}
            name='Haskell'
            tag='haskell'
          />

          <Language 
            icon={rubyIcon}
            name='Ruby'
            tag='ruby'
          />

          <Language 
            icon={phpIcon}
            name='PHP'
            tag='php'
          />

        </Grid>
      </div>
    )
  }
}

export default Languages