import React, { Component } from 'react'
// import IconButton from 'material-ui/IconButton'
// import Icon from 'material-ui/Icon';
// import Button from 'material-ui/Button'
// import { 
//   Table, 
//   TableBody, 
//   TableHeader, 
//   TableHeaderColumn, 
//   TableRow, 
//   TableRowColumn 
// } from 'material-ui/Table'
// import Switch from 'material-ui/Switch'


class UserSettings extends Component {
  static propTypes = {}

  handleMonitorPackage = (packageId, isChecked) => {
    console.log(packageId, isChecked)
  }

  handleRemovePackage = (packageId) => {
    console.log(packageId)
  }

  render() {
    return (
      <div>
        <h2>Settings</h2>
         {/* <Table selectable={false}>
          <TableHeader 
            displaySelectAll={false}
            adjustForCheckbox={false}
          >
            <TableRow>
              <TableHeaderColumn style={{ paddingLeft: '0' }}>Package</TableHeaderColumn>
              <TableHeaderColumn>Github Stars</TableHeaderColumn>
              <TableHeaderColumn style={{ width: '350px' }}>Github Repo</TableHeaderColumn>
              <TableHeaderColumn>Monitor Changelog</TableHeaderColumn>
              <TableHeaderColumn>Detail Page</TableHeaderColumn>
              <TableHeaderColumn style={{ textAlign: 'center' }}>Remove</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            <TableRow>
              <TableRowColumn style={{ paddingLeft: '0' }}>React</TableRowColumn>
              <TableRowColumn>12438981</TableRowColumn>
              <TableRowColumn style={{ width: '350px' }}>
                <a 
                  href="https://github.com/facebook/react" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://github.com/facebook/react
                </a>
              </TableRowColumn>
              <TableRowColumn>
                <Switch
                  checked={true}
                  onToggle={(e, isChecked) => this.handleMonitorPackage('123', isChecked)}
                />
              </TableRowColumn>
              <TableRowColumn>
                <Button 
                  raised
                  color="primary"
                >
                  View
                </Button>
              </TableRowColumn>
              <TableRowColumn style={{ textAlign: 'center' }}>
                <IconButton
                  onClick={() => this.handleRemovePackage('123')}
                >
                  <Delete />
                </IconButton>
              </TableRowColumn>
            </TableRow>
          </TableBody>
         </Table> */}
      </div>
    )
  }
}

export default UserSettings