import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import styled from "styled-components";
import { Link } from "react-router-dom";
import findIndex from 'lodash/findIndex'

import Grid from "material-ui/Grid";
import Button from "material-ui/Button";

import { KanbanBoardContainer } from "../Kanban";
import { Loader } from '../Shared'

import userBgImg from "../../images/user_profile_bg.jpg"

import USER_KANBAN_PACKAGES from '../../queries/userKanbanPackages'
import GET_USER from '../../queries/user'

const ProfileHeader = styled.div`
  position: relative;
  z-index: 1;
  height: 275px;
  width: 100%;
  margin-bottom: 20px;
  background: url("${userBgImg}") no-repeat center;
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
  _formatCards = (packages) => {
    const { kanbanCardPositions } = this.props.user.user
    const cards = []
    if (!packages || !packages.length) return cards

    for (let i in kanbanCardPositions) {
      const layout = kanbanCardPositions[i]
      const pkgIndex = findIndex(packages, (o) => {
        return o.ownerName === layout.ownerName && o.packageName === layout.packageName
      });
      let pkg = packages[pkgIndex]
      
      if (pkg) {
        pkg.board = layout.board
        cards.push(pkg)
      }
    }
    return cards
  }

  render() {
    const { currentUser, user, userKanbanPackages } = this.props;
    if (user.loading || userKanbanPackages.loading ) return <Loader />
    const cards = this._formatCards(userKanbanPackages.userKanbanPackages)

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
                <Link
                  className="white no-underline fw3"
                  to={user.user.website}
                >
                  {user.user.website}
                </Link>
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
                      className='white'
                      to={`/@${user.user.username}/connections`}
                    >
                      Connections
                    </Link>
                  </Connections>
                  <Button raised style={{ verticalAlign: 'text-bottom' }}>
                    Connect
                  </Button>}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </ProfileHeader>
        
        <KanbanBoardContainer
          cards={cards}
          currentUser={currentUser}
          user={user.user}
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
  graphql(GET_USER, userOptions),
  graphql(USER_KANBAN_PACKAGES, userKanbanOptions),
)(UserProfile)