import React, { Component } from 'react'

import { KanbanBoardContainer } from '../Kanban'

class UserProfile extends Component {
  render() {
    const { user } = this.props

    return (
      <div>
        <h2>User Profile</h2>
        <KanbanBoardContainer 
          cards={!user.packages ? [] : user.packages}
          user={user}
        />
      </div>
    );
  }
}

export default UserProfile
