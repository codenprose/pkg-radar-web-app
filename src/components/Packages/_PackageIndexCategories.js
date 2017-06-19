import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {List, ListItem, makeSelectable} from 'material-ui/List'
import Subheader from 'material-ui/Subheader'


let SelectableList = makeSelectable(List)

function wrapState(ComposedComponent) {
  return class SelectableList extends Component {
    static propTypes = {
      children: PropTypes.node.isRequired,
      defaultValue: PropTypes.number.isRequired,
    }

    componentWillMount() {
      this.setState({
        selectedIndex: this.props.defaultValue,
      })
    }

    handleRequestChange = (event, index) => {
      this.setState({
        selectedIndex: index,
      })
    }

    render() {
      return (
        <ComposedComponent
          value={this.state.selectedIndex}
          onChange={this.handleRequestChange}
        >
          {this.props.children}
        </ComposedComponent>
      )
    }
  }
}

SelectableList = wrapState(SelectableList)

class PackageIndexCategories extends Component {
  render() {
    return (
      <div>
        <SelectableList defaultValue={0}>
          <Subheader>Categories</Subheader>
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
        </SelectableList>
      </div>
    )
  }
}

export default PackageIndexCategories