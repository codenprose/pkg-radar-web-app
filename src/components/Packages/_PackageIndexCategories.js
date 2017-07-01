import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import {List, ListItem, ListSubheader} from 'material-ui/List'

class PackageIndexCategories extends Component {
  render() {
    return (
      <div>
        <List 
          subheader={<ListSubheader>Settings</ListSubheader>}
        >
          <ListItem
            value={0}
            primaryText="All"
          />
          <ListItem
            value={1}
            primaryText="JavaScript"
          />
          <ListItem
            value={2}
            primaryText="Python"
          />
        </List>
      </div>
    )
  }
}

export default PackageIndexCategories