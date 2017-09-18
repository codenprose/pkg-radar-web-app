import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import styled from "styled-components";
import { Link } from "react-router-dom";
import findIndex from 'lodash/findIndex'

import Grid from "material-ui/Grid";
import Button from "material-ui/Button";

import { KanbanBoardContainer } from "../Kanban";
import { Loader } from '../Shared'

import radarBgImg from "../../images/nathan_anderson_radar.jpg"

import CURRENT_USER from '../../queries/currentUser'
import CREATE_USER_CONNECTION from '../../mutations/createUserConnection'
import DELETE_USER_CONNECTION from '../../mutations/deleteUserConnection'
import GET_USER_KANBAN_PACKAGES from '../../queries/userKanbanPackages'
import GET_USER from '../../queries/user'

const ProfileHeader = styled.div`
  position: relative;
  z-index: 1;
  height: 250px;
  width: 100%;
  margin-bottom: 20px;
  background: url("${radarBgImg}") no-repeat center;
  background-size: cover;

  &:after {
    content: "";
    position: absolute;
    z-index: -2;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(0, 0, 0, .3), rgba(0, 0, 0, .3));
  }
`;

const ProfileImage = styled.img`
  height: 140px;
  width: 140px;
  border-radius: 50%;
  vertical-align: middle;
`;

const UserInfoContainer = styled.div`
  display: inline-block;
  margin-left: 40px;
  vertical-align: middle;
`;

const Name = styled.h3`
  color: white;
  font-size: 24px;
  margin: 0 0 5px;
`;

const UserName = styled.h4`
  margin: 0 0 10px;
  font-size: 18px;
  font-weight: normal;
  color: white;
`;

const Bio = styled.p`
  margin-bottom: 5px;
  color: white;
  font-size: 14px;
  font-weight: 300;
`;

const Packages = styled.h5`
  display: inline-block;
  margin-right: 20px;
  color: white;
  font-size: 18px;
  font-weight: normal;
`

const Connections = styled.h5`
  display: inline-block;  
  margin-right: 20px;
  color: white;
  font-size: 18px;
  font-weight: normal;
`

class UserProfile extends Component {
  _formatCards = () => {
    const packages = this.props.userKanbanPackages.userKanbanPackages
    const { kanbanCards } = this.props.user.user
    
    const cards = []
    if (!packages || !packages.length) return cards

    for (let i in kanbanCards) {
      const layout = kanbanCards[i]
      const pkgIndex = findIndex(packages, (o) => {
        return o.ownerName === layout.ownerName && o.packageName === layout.packageName
      });
      let pkg = packages[pkgIndex]
      
      if (pkg) {
        pkg = {...pkg, board: layout.board }
        cards.push(pkg)
      }
    }
    return cards
  }

  _createUserConnection = async () => {
    const { currentUser, user } = this.props
    if (!currentUser) return alert('Please login first')
    
    const token = localStorage.getItem('pkgRadarToken')
    console.log('adding connection')

    try {
      await this.props.createUserConnection({
        variables: {
          user: currentUser.username,
          connection: user.user.username
        },
        refetchQueries: [
          {
            query: CURRENT_USER,
            variables: { username: currentUser.username, token }
          },
          {
            query: GET_USER,
            variables: { username: user.user.username }
          }
        ]
      })
      console.log('added connection')
    } catch (e) {
      console.error(e.message)
    }
  }

  _deleteUserConnection = async () => {
    console.log('removing connection')
    const { currentUser, user } = this.props
    const token = localStorage.getItem('pkgRadarToken')

    try {
      await this.props.deleteUserConnection({
        variables: {
          user: currentUser.username,
          connection: user.user.username
        },
        refetchQueries: [
          {
            query: CURRENT_USER,
            variables: { username: currentUser.username, token }
          },
          {
            query: GET_USER,
            variables: { username: user.user.username }
          }
        ]
      })
      console.log('removed connection')
    } catch (e) {
      console.error(e.message)
    }
  }

  _isCurrentUserConnected = () => {
    const { currentUser, user } = this.props
    if (!currentUser) return false
    const index = findIndex(currentUser.connections, obj => {
      return obj.username === user.user.username
    })
    if (index >= 0) return true
    return false
  }

  _renderUserConnectionBtn = () => {
    const { currentUser, user } = this.props
    if (currentUser.username !== user.user.username) {
      if (this._isCurrentUserConnected()) {
        return (
          <Button 
            raised
            onClick={this._deleteUserConnection}
            style={{ verticalAlign: 'text-bottom' }}
          >
            Connected
          </Button>
        )
      } else {
        return (
          <Button 
            raised 
            onClick={this._createUserConnection}
            style={{ verticalAlign: 'text-bottom' }}
          >
            Connect
          </Button>
        )
      }
    }
  }

  _userIsCurrentUser = () => {
    const { currentUser, user } = this.props
    return currentUser.username === user.user.username
  }

  render() {
    const { currentUser, isCurrentUserLoading, user, userKanbanPackages } = this.props;
    if (user.loading || userKanbanPackages.loading || isCurrentUserLoading  ) return <Loader />
    
    const cards = this._formatCards()
    // console.log('props', this.props)

    return (
      <div>
        <ProfileHeader>
          <Grid
            container
            direction="row"
            align="center"
            style={{ height: "100%", padding: "0 80px", margin: 0 }}
          >
            <Grid item xs={6}>
              <ProfileImage src={user.user.avatar} />
              <UserInfoContainer>
                <Name>
                  {user.user.name}
                </Name>
                <UserName>
                  @{user.user.username}
                </UserName>
                <Bio>{user.user.bio}</Bio>
                <a
                  className="white no-underline fw3"
                  to={user.user.website}
                >
                  {user.user.website}
                </a>
              </UserInfoContainer>
            </Grid>
            <Grid item xs={6}>
              <Grid direction="row" container justify="flex-end">
                <Grid item className="tc">
                  <Packages>
                    <div>{cards.length}</div>
                    <div>Packages</div>
                  </Packages>
                  <Connections>
                    <div>{user.user.connections.length}</div>
                    <Link 
                      className='white no-underline'
                      to={`/@${user.user.username}/connections`}
                    >
                      Connections
                    </Link>
                  </Connections>
                  {this._renderUserConnectionBtn()}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </ProfileHeader>
        
        <KanbanBoardContainer
          cards={cards}
          currentUser={currentUser}
          user={user.user}
          userIsCurrentUser={this._userIsCurrentUser()}
        />
      </div>
    );
  }
}

const userOptions = {
  name: 'user',
  options: props => {
    return {
      fetchPolicy: 'network-only',
      variables: { 
        username: props.match.params.username
      }
    };
  }
}

const userKanbanOptions = {
  name: 'userKanbanPackages',
  options: props => {
    return {
      fetchPolicy: 'network-only',
      variables: { 
        username: props.match.params.username
      }
    };
  }
};

export default compose(
  graphql(CREATE_USER_CONNECTION, { name: 'createUserConnection' }),
  graphql(DELETE_USER_CONNECTION, { name: 'deleteUserConnection' }),
  graphql(GET_USER, userOptions),
  graphql(GET_USER_KANBAN_PACKAGES, userKanbanOptions),
)(UserProfile)