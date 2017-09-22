import React, { Component } from 'react';
import List, {
  ListItem,
  ListItemIcon,
  ListSubheader,
  ListItemText,
} from 'material-ui/List';
import Icon from 'material-ui/Icon';

class PackageIndexCategories extends Component {
  static defaultProps = {
    categories: []
  }
  
  render() {
    return (
      <div style={{  marginTop: '-28px' }}>
        <List>
          <ListSubheader 
            style={{ paddingLeft: 0 }}
          >
            Categories
          </ListSubheader>
          <ListItem button style={{ backgroundColor: 'rgba(0, 0, 0, 0.12)'}}>
            <ListItemIcon>
              <Icon>inbox</Icon>
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