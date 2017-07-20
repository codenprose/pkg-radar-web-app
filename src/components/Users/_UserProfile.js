import React, { Component } from "react";
import Grid from "material-ui/Grid";
import styled from "styled-components";
import { Link } from "react-router-dom";

import { KanbanBoardContainer } from "../Kanban";
import userBgImg from "../../images/user_profile_bg.jpg"

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

const Subscriptions = Packages

class UserProfile extends Component {
  render() {
    const { user } = this.props;

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
                <Bio>developer, designer, entrepreneur</Bio>
                <Link
                  className="white no-underline fw3"
                  to={`danielkhunter.com`}
                >
                  danielkhunter.com
                </Link>
              </UserInfoContainer>
            </Grid>
            <Grid item xs={6}>
              <Grid direction="row" container justify="flex-end">
                <Grid item className="tc">
                  <Packages>
                    <div>
                      {user.packages ? user.packages.length : 0}
                    </div>
                    <div>Packages</div>
                  </Packages>
                  <Subscriptions>
                    <div>{user.subscriptions ? user.subscriptions.length : 0}</div>
                    <div>Subscriptions</div>
                  </Subscriptions>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </ProfileHeader>

        <KanbanBoardContainer
          cards={!user.packages ? [] : user.packages}
          user={user}
        />
      </div>
    );
  }
}

export default UserProfile;
