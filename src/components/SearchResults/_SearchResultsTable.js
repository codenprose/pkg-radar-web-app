import React from 'react';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import { Link } from 'react-router-dom';
import Button from "material-ui/Button";
import Humanize from "humanize-plus";

const SearchResultsTable = ({ data }) => {
  if (!data.length) {
    return <h3>No Results Found</h3>;
  }

  return (
      <Paper style={{ overflow: 'auto', marginBottom: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell disablePadding style={{ minWidth: '90px' }}></TableCell>
              {/* <TableCell style={{ paddingRight: '0' }}>Owner</TableCell> */}
              <TableCell style={{ paddingRight: '0' }}>Package</TableCell>
              <TableCell>Language</TableCell>
              <TableCell style={{ paddingRight: '0' }}>Description</TableCell>
              <TableCell disablePadding></TableCell>
              <TableCell numeric compact style={{ textAlign: 'left' }}>Stars</TableCell>
              <TableCell numeric compact style={{ textAlign: 'left' }}>Issues</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, i) => {
              const pkg = item._source
              return (
                <TableRow key={i}>
                  <TableCell style={{ minWidth: '54px', padding: '0 0 0 24px' }}>
                    <span className='fa fa-fw' style={{ marginRight: '15px', fontSize: '14px', verticalAlign: 'super' }}>{i + 1})</span>
                    <img
                      alt={`${pkg.package_name}`}
                      style={{ height: "30px" }}
                      src={pkg.owner_avatar}
                    />
                  </TableCell>
                  {/* <TableCell style={{ paddingRight: '0' }}>
                    {pkg.owner_name}
                  </TableCell> */}
                  <TableCell style={{ paddingRight: '0' }}>
                    {pkg.package_name}
                  </TableCell>
                  <TableCell>{pkg.language}</TableCell>
                  <TableCell style={{ paddingRight: '0' }}>
                    {Humanize.truncate(pkg.description, 120)}
                  </TableCell>
                  <TableCell disablePadding>
                    <Link 
                      className='no-underline'
                      to={`/${pkg.owner_name}/${pkg.package_name}`}
                    >
                      <Button>View</Button>
                    </Link>
                  </TableCell>
                  <TableCell 
                    numeric 
                    compact
                    style={{ textAlign: 'left' }}
                  >
                    {Humanize.formatNumber(pkg.stars)}
                  </TableCell>
                  <TableCell 
                    numeric 
                    compact
                    style={{ textAlign: 'left' }}
                  >
                    {Humanize.formatNumber(pkg.issues)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
  );
};

export default SearchResultsTable;
