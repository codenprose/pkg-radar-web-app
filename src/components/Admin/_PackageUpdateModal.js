import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo'
import swal from 'sweetalert2';

import Button from "material-ui/Button";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog'
import TextField from 'material-ui/TextField';
// import { SnackbarContent } from 'material-ui/Snackbar';

import UPDATE_PACKAGE from '../../mutations/updatePackage'

class PackageUpdateModal extends Component {
  state = {
    isUpdatePackageLoading: false,
    isModalOpen: this.props.isModalOpen,
    currentTag: '',
    currentPackage: this.props.currentPackage
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ 
      isModalOpen: nextProps.isModalOpen, 
      currentPackage: nextProps.currentPackage 
    })
  }

  _handleModalClose = () => {
    this.setState({ isModalOpen: false, currentTag: '' })
  }

  _handleUpdatePackage = async () => {
    this.setState({ isUpdatePackageLoading: true });
    console.log('updating package...')

    try {
      const { currentPackage } = this.state;
      const data = {
        tags: currentPackage.tags
      }
      const response = await this.props.updatePackage({
        variables: { 
          owner: currentPackage.owner_name, 
          name: currentPackage.package_name, 
          data: JSON.stringify(data) 
        }
      })

      console.log('updated package');
      console.log(response);

      this.setState({ 
        isModalOpen: false, 
        isUpdatePackageLoading: false 
      });
    } catch(e) {
      this.setState({ 
        isModalOpen: false,
        isUpdatePackageLoading: false 
      });
      console.error(e);
      swal({
        text: `Error Updating Tags`,
        type: 'error'
      })
    }
  }

  _handleAddCurrentTag = () => {
    const { currentPackage, currentTag } = this.state;
    const updatedPackage = {
      ...currentPackage,
      tags: [...currentPackage.tags, currentTag]
    }
    this.setState({ currentPackage: updatedPackage, currentTag: '' })
  }

  render() {
    const { currentPackage } = this.state;

    return (
      <Dialog
        open={this.state.isModalOpen}
        onRequestClose={this._handleModalClose}
      >
        <DialogTitle>Update Package: {currentPackage.package_name}</DialogTitle>
        <DialogContent style={{ width: '500px' }}>
          <h4>Tags</h4>
          {
            currentPackage.tags.map(tag => {
              return (
                <span key={tag} style={{ marginRight: '5px' }}>{tag}</span>
              )
            })
          }
          <div>
            <TextField
              placeholder="Add New Tag"
              value={this.state.currentTag}
              onChange={(e) => this.setState({ currentTag: e.target.value })}
              margin="normal"
              style={{ width: '50%' }}
            />
            <Button
              className="mr3 dib"
              onClick={this._handleAddCurrentTag}
            >
              Add Tag
            </Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            className="mr3"
            onClick={this._handleModalClose}
          >
            Cancel
          </Button>
          <Button
            raised
            color="primary"
            onClick={this._handleUpdatePackage}
            disabled={this.state.isUpdatePackageLoading}
          >
            {this.state.isUpdatePackageLoading &&
              <i className="fa fa-spinner fa-spin mr1" />}
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

export default compose(
  graphql(UPDATE_PACKAGE, { name: 'updatePackage' }),
)(PackageUpdateModal)