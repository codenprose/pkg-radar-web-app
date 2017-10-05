import React, { Component } from 'react';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import { Link } from 'react-router-dom';
import Button from "material-ui/Button";
import Humanize from "humanize-plus";

import { Loader } from '../Shared'
import PackageUpdateModal from './_PackageUpdateModal';

class Packages extends Component {
  state = {
    packages: [],
    isLoading: false,
    isModalOpen: false,
    currentPackage: null,
  }

  componentWillMount() {
    this._fetchPackages()
  }

  _fetchPackages = async () => {
    try {
      this.setState({ isLoading: true });
      const endpoint = `https://search-pkg-radar-prod-5zmur6rydaff4ppn7s5zbmyvbu.us-east-1.es.amazonaws.com/_all/packages/_search`;

      const body = {
        from : 0,
        size : 500,
        sort: [
          {"stars" : {"order" : "desc", "unmapped_type" : "long"}}
       ]
      }

      const options = {
        method: 'POST',
        'Content-Type': 'application/json',
        body: JSON.stringify(body)
      }

      const response = await fetch(endpoint, options);
      const json = await response.json();

      const hits = json.hits.hits
      if (hits.length) {
        this.setState({ packages: hits, isLoading: false })
      } else {
        this.setState({ packages: [], isLoading: false })
      }
    } catch(e) {
      console.error(e)
      this.setState({ isLoading: false });
    }
  }

  _handleModalOpen = (pkg) => {
    this.setState({ currentPackage: pkg, isModalOpen: true })
  }

  render() {
    const { isLoading, currentPackage, packages } = this.state;
    if (isLoading) return <Loader />

    return (
      <div>
        <Paper style={{ overflow: 'auto', marginBottom: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell disablePadding style={{ minWidth: '54px' }}></TableCell>
                <TableCell style={{ paddingRight: '0' }}>Owner</TableCell>
                <TableCell style={{ paddingRight: '0' }}>Package</TableCell>
                <TableCell>Language</TableCell>
                <TableCell numeric compact style={{ textAlign: 'left' }}>Stars</TableCell>
                <TableCell numeric compact style={{ textAlign: 'left' }}>Tags</TableCell>
                <TableCell disablePadding></TableCell>
                <TableCell disablePadding></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {packages.map((item, i) => {
                const pkg = item._source;
                return (
                  <TableRow key={i}>
                    <TableCell style={{ minWidth: '54px', padding: '0 0 0 24px' }}>
                      <img
                        alt={`${pkg.package_name}`}
                        style={{ height: "30px" }}
                        src={pkg.owner_avatar}
                      />
                    </TableCell>
                    <TableCell style={{ paddingRight: '0' }}>
                      {pkg.owner_name}
                    </TableCell>
                    <TableCell style={{ paddingRight: '0' }}>
                      {pkg.package_name}
                    </TableCell>
                    <TableCell>{pkg.language}</TableCell>
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
                      {pkg.tags.length}
                    </TableCell>
                    <TableCell disablePadding>
                      <Button onClick={() => this._handleModalOpen(pkg)}>Update</Button>
                    </TableCell>
                    <TableCell disablePadding>
                      <Link 
                        className='no-underline'
                        to={`/${pkg.owner_name}/${pkg.package_name}`}
                      >
                        <Button>View</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
        {
          currentPackage &&
          <PackageUpdateModal 
            isModalOpen={this.state.isModalOpen}
            currentPackage={currentPackage}
          />
        }
      </div>
    )
  }
}

export default Packages;
