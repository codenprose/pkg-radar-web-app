import React, { Component } from 'react'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table'
import FlatButton from 'material-ui/FlatButton'
import { Link } from 'react-router-dom'


class PackageIndexTable extends Component {

  static defaultProps = {
    data: {
      packages: [
        {
          id: '232gad4',
          name: 'React',
          github: {
            stars: 65323,
            issues: 323
          },
          radar: {
            assess: 0,
            pilot: 0,
            production: 100,
            archive: 0
          }
        },
        {
          id: 'dfjkl231',
          name: 'GraphQL',
          github: {
            stars: 45323,
            issues: 223
          },
          radar: {
            assess: 0,
            pilot: 0,
            production: 100,
            archive: 0
          }
        }
      ]
    }
  }
  
  _renderPackages() {
    const { data } = this.props
    if (data.loading) return <div>Loading...</div>

    return data.packages.map(item => {
      return (
        <TableRow key={item.id}>
          <TableRowColumn>{item.name}</TableRowColumn>
          <TableRowColumn>{item.github.stars}</TableRowColumn>
          <TableRowColumn>{item.github.issues}</TableRowColumn>
          <TableRowColumn>{item.radar.assess}%</TableRowColumn>
          <TableRowColumn>{item.radar.pilot}%</TableRowColumn>
          <TableRowColumn>{item.radar.production}%</TableRowColumn>
          <TableRowColumn>{item.radar.archive}%</TableRowColumn>
          <TableRowColumn>
            <Link to={`/package/${item.name.toLowerCase()}`}>
              <FlatButton label="view" />
            </Link>
          </TableRowColumn>
        </TableRow>
      )
    })
  }

  render() {
    return (
      <Table selectable={false}>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow selectable={false}>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Stars</TableHeaderColumn>
            <TableHeaderColumn>Issues</TableHeaderColumn>
            <TableHeaderColumn>Assess</TableHeaderColumn>
            <TableHeaderColumn>Pilot</TableHeaderColumn>
            <TableHeaderColumn>Production</TableHeaderColumn>
            <TableHeaderColumn>Archive</TableHeaderColumn>
            <TableHeaderColumn></TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {this._renderPackages()}
        </TableBody>
      </Table>
    )
  }
}

export default PackageIndexTable