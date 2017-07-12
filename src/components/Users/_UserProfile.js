import React, { Component } from 'react'

import { KanbanBoardContainer } from '../Kanban'

class UserProfile extends Component {
  static defaultProps = {
    data: {
      packages: [
        {
          id: 1,
          name: "react",
          description: "I should read the whole book",
          stars: 238497,
          avatar: 'https://avatars0.githubusercontent.com/u/69631?v=3&s=200',
          status: "production",
        },
        {
          id: 2,
          name: "flow",
          description: "Code along with the samples in the book",
          stars: 32389,
          avatar: 'https://avatars0.githubusercontent.com/u/69631?v=3&s=200',
          status: "backlog",
        },
      ]
    }
  }

  render() {
    const { data } = this.props

    if (data.loading) return

    return (
      <div>
        <h2>User Profile</h2>
        <KanbanBoardContainer cards={data.packages} />
      </div>
    );
  }
}

export default UserProfile
