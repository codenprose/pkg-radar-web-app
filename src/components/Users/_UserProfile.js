import React, { Component } from "react";
import { graphql, compose } from "react-apollo";
import Grid from "material-ui/Grid";
import styled from "styled-components";
import { Link } from "react-router-dom";
import findIndex from 'lodash/findIndex'

import { KanbanBoardContainer } from "../Kanban";
import userBgImg from "../../images/user_profile_bg.jpg"

import USER_KANBAN_PACKAGES from '../../queries/userKanbanPackages'

const ProfileHeader = styled.div`
  position: relative;
  z-index: -1;
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
    const { kanbanCardPositions } = this.props.user
    const cards = []

    if (!packages || !packages.length) return cards

    for (let i in kanbanCardPositions) {
      const layout = kanbanCardPositions[i]
      const pkgIndex = findIndex(packages, (o) => {
        return o.ownerName === layout.ownerName && o.packageName === layout.packageName
      });
      let pkg = packages[pkgIndex]
      if (pkg) cards.push(pkg)
    }
    return cards
  }

  render() {
    const { data, user } = this.props;
    if (!user || data.loading) return <div />

    const cards = this._formatCards(data.userKanbanPackages)

    return (
      <div>
        <ProfileHeader>
          <Grid
            container
            direction="row"
            align="center"
            style={{ height: "100%", padding: "0 40px", margin: 0 }}
          >
            <Grid item xs={6}>
              <ProfileImage src={user.avatar} />
              <UserInfoContainer>
                <Name>
                  {user.name}
                </Name>
                <UserName>
                  @{user.username}
                </UserName>
                <Bio>{user.bio}</Bio>
                <Link
                  className="white no-underline fw3"
                  to={user.website}
                >
                  danielkhunter.com
                </Link>
              </UserInfoContainer>
            </Grid>
            <Grid item xs={6}>
              <Grid direction="row" container justify="flex-end">
                <Grid item className="tc">
                  <Connections>
                    <div>{0}</div>
                    <div>Connections</div>
                  </Connections>
                  <Packages>
                    <div>{cards.length}</div>
                    <div>Packages</div>
                  </Packages>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </ProfileHeader>
        <KanbanBoardContainer
          cards={cards}
          user={user} 
        />
      </div>
    );
  }
}

const userKanbanOptions = {
  skip: (props) => {
    return !props.user
  },
  options: props => {
    return {
      variables: { 
        userId: props.user.id,
      }
    };
  }
};

export default compose(
  graphql(USER_KANBAN_PACKAGES, userKanbanOptions),
)(UserProfile)