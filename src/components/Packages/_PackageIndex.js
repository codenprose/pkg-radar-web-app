import React, { Component } from 'react'
import { Row, Col } from 'react-flexbox-grid'

// import PackageIndexCategories from './_PackageIndexCategories
import PackageIndexTable from './_PackageIndexTable'


class PackageIndex extends Component {
  render() {
    return (
      <div>
        <Row className="h-100">
          <Col xs={3}>
            <Row className="h-100">
              <Col xs={12}>
                {/*<PackageIndexCategories />*/}
              </Col>
            </Row>
          </Col>
          <Col xs={9}>
            <Row className="h-100">
              <Col xs={12}>
                <PackageIndexTable />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    )
  }
}

export default PackageIndex