import React, { Component } from 'react';

import Button from "material-ui/Button";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from 'material-ui/Dialog'
import TextField from 'material-ui/TextField';

class UpdatePackageModal extends Component {
  state = {
    isUpdatePackageLoading: false,
    isModalOpen: this.props.isModalOpen,
    currentTag: '',
    currentPackage: this.props.currentPackage
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ isModalOpen: nextProps.isModalOpen })
  }

  _handleModalClose = () => {
    this.setState({ isModalOpen: false, currentTag: '' })
  }

  _handleUpdatePackage = async () => {
    try {
      // const { currentTag, currentTags } = this.state;
      // let tags = [...currentTags, currentTag];
      this.setState({ isUpdatePackageLoading: true });
    } catch(e) {
      console.error(e);
      this.setState({ isUpdatePackageLoading: false });
    }
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

export default UpdatePackageModal;