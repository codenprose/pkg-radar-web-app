import React, { Component } from 'react'
import Grid from 'material-ui/Grid'
import styled from 'styled-components'
import Card, { CardHeader, CardActions, CardContent } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'

const ListContainer = styled.div`
  padding: 10px;
  background-color: #EEEEEE;
`

const ListTitle = styled.h3`
  font-size: 20px;
  font-weight: 200;
  margin: 0;
`

const ListCard = ({ name, description, avatar, stars }) => {
  return (
    <Card>
      <CardHeader
        title={name}
        subheader={`stars: ${stars}`}
      />
      <CardContent>
        <Typography component='p'>
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button dense>View Package</Button>
      </CardActions>
    </Card>
  )
}

class UserProfile extends Component {
  render() {
    return (
      <div>
        <h2>User Profile</h2>
        <Grid container>
          <Grid item xs={3}>
            <ListContainer>
              <ListTitle>Backlog</ListTitle>
            </ListContainer>
          </Grid>
          <Grid item xs={3}>
            <ListContainer>
              <ListTitle>Staging</ListTitle>
            </ListContainer>
          </Grid>
          <Grid item xs={3}>
            <ListContainer>
              <ListTitle>Production</ListTitle>
            </ListContainer>
          </Grid>
          <Grid item xs={3}>
            <ListContainer>
              <ListTitle>Archive</ListTitle>
            </ListContainer>
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default UserProfile
