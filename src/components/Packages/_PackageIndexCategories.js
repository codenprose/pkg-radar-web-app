import React, { Component } from 'react';
import List, {
  ListItem,
  ListItemIcon,
  ListSubheader,
  ListItemText,
} from 'material-ui/List';
import InboxIcon from 'material-ui-icons/Inbox';

class PackageIndexCategories extends Component {
  static defaultProps = {
    categories: []
  }
  render() {
    return (
      <div>
        <List>
          <ListSubheader style={{ paddingLeft: 0 }}>
            Categories
          </ListSubheader>
          <ListItem button style={{ backgroundColor: 'rgba(0, 0, 0, 0.12)'}}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText
              primary="All"
            />
          </ListItem>
        </List>
      </div>
    )
  }
}

export default PackageIndexCategories;