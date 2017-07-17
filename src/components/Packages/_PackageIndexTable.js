import React from 'react';
import PropTypes from 'prop-types';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';

function PackageIndexTable(props) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Avatar</TableCell>
          <TableCell>Name</TableCell>
          <TableCell numeric>Stars</TableCell>
          <TableCell numeric>Issues</TableCell>
          {/* <TableCell numeric>Backlog</TableCell>
          <TableCell numeric>Staging</TableCell>
          <TableCell numeric>Production</TableCell>
          <TableCell numeric>Archive</TableCell> */}
        </TableRow>
      </TableHead>
      <TableBody>
        {props.packages.map(n => {
          return (
            <TableRow key={n.id}>
              <TableCell style={{ padding: '10px 56px 10px 24px' }}>
                <img 
                  alt={`${n.name}-logo`}
                  style={{ height: '40px' }} 
                  src={n.avatar} 
                />
              </TableCell>
              <TableCell>{n.name}</TableCell>
              <TableCell numeric>{n.stars}</TableCell>
              <TableCell numeric>{n.issues}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

PackageIndexTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default PackageIndexTable;