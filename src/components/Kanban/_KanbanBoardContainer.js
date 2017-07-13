import React, { Component } from "react";
import update from "immutability-helper";
import { graphql } from "react-apollo";
import Button from "material-ui/Button";
import AddIcon from "material-ui-icons/Add";
import throttle from "lodash/throttle";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "material-ui/Dialog";
import { LabelRadio } from "material-ui/Radio";

import KanbanBoard from "./_KanbanBoard";
import SearchPackages from "./_SearchPackages";
import UPDATE_USER_PACKAGES_MUTATION from "../../mutations/updateUserPackages";

class KanbanBoardContainer extends Component {
  state = {
    cards: this.props.cards,
    isAddPackageModalOpen: false,
    packageSearchText: "",
    packageStatus: "",
    selectedPackage: {}
  };

  updateCardStatus = (cardId, listId) => {
    // Find the index of the card
    let cardIndex = this.state.cards.findIndex(card => card.id === cardId);
    // Get the current card
    let card = this.state.cards[cardIndex];
    // Only proceed if hovering over a different list
    if (card.status !== listId) {
      // set the component state to the mutated object
      this.setState(
        update(this.state, {
          cards: {
            [cardIndex]: {
              status: { $set: listId }
            }
          }
        })
      );
    }
  };

  updateCardPosition = (cardId, afterId) => {
    // Only proceed if hovering over a different card
    if (cardId !== afterId) {
      // Find the index of the card
      let cardIndex = this.state.cards.findIndex(card => card.id === cardId);
      // Get the current card
      let card = this.state.cards[cardIndex];
      // Find the index of the card the user is hovering over
      let afterIndex = this.state.cards.findIndex(card => card.id === afterId);
      // Use splice to remove the card and reinsert it a the new index
      this.setState(
        update(this.state, {
          cards: {
            $splice: [[cardIndex, 1], [afterIndex, 0, card]]
          }
        })
      );
    }
  };

  updateUserPackages = async () => {
    console.log("updating user packages");
    // console.table(this.state.cards)

    try {
      const response = await this.props.updateUserPackages({
        variables: {
          id: this.props.user.id,
          packages: this.state.cards
        }
      });
      console.log("user packages updated");
      console.table(response.data.updateUser.packages);
      this._handlePackageModalClose()
    } catch (e) {
      console.error(e);
      this._handlePackageModalClose()
    }
  };

  _addCard = (card) => {
    // Keep a reference to the original state prior to the mutations
    // in case we need to revert the optimistic changes in the UI
    // let prevState = this.state;

    // Create a new object and push the new card to the array of cards
    let nextState = update(this.state.cards, { $push: [card] });

    // set the component state to the mutated object
    this.setState({ cards: nextState });
  };

  _removeCard = (id) => {
    // Filter out selected card
    let nextState = [...this.state.cards].filter(card => card.id !== id)

    this.setState({ cards: nextState }, this.updateUserPackages)
  }

  _handlePackageModalOpen = () => {
    this.setState({ isAddPackageModalOpen: true });
  };

  _handlePackageModalClose = () => {
     this.setState({ isAddPackageModalOpen: false });
  }

  _handlePackageStatus = (e) => {
    this.setState({ packageStatus: e.target.value });
  };

  _handlePackageSelect = (pkg) => {
    const { id, name, avatar, description, stars } = pkg
    const { packageStatus } = this.state

    const selectedPackage = { id, name, avatar, description, stars, status: packageStatus }

    if (!packageStatus) {
      alert('Please select a list')
    } else {
      this.setState({ selectedPackage }, this._addCard(selectedPackage))
    }
  }

  render() {
    // console.log(this.state.cards)
    return (
      <div>
        <KanbanBoard
          cards={this.state.cards}
          cardCallbacks={{
            updateStatus: throttle(this.updateCardStatus),
            updatePosition: throttle(this.updateCardPosition, 500),
            persistCardDrag: this.updateUserPackages,
            removeCard: this._removeCard
          }}
        />
        <Button
          fab
          color="primary"
          style={{ position: "fixed", bottom: "20px", right: "20px" }}
          onClick={this._handlePackageModalOpen}
        >
          <AddIcon />
        </Button>
        <Dialog
          open={this.state.isAddPackageModalOpen}
          onRequestClose={this._handlePackageModal}
        >
          <DialogTitle>Add Package</DialogTitle>
          <DialogContent style={{ width: "500px", marginBottom: '20px' }}>
            <DialogContentText style={{ marginBottom: "10px" }}>
              Select List and Enter a Package Name below:
            </DialogContentText>
            <div className="mb3">
              <LabelRadio 
                label="Backlog" 
                value="backlog"
                checked={this.state.packageStatus === 'backlog'}
                onChange={this._handlePackageStatus}
              />
              <LabelRadio 
                label="Staging" 
                value="staging"
                checked={this.state.packageStatus === 'staging'}
                onChange={this._handlePackageStatus}
              />
              <LabelRadio 
                label="Production" 
                value="production"
                checked={this.state.packageStatus === 'production'}
                onChange={this._handlePackageStatus}
              />
              <LabelRadio 
                label="Archive" 
                value="archive"
                checked={this.state.packageStatus === 'archive'}
                onChange={this._handlePackageStatus}
              />
            </div>
            <SearchPackages 
              _handlePackageSelect={this._handlePackageSelect}
              packageStatus={this.state.packageStatus}
            />
          </DialogContent>
          <DialogActions>
            <Button className="mr3" onTouchTap={this._handlePackageModalClose}>
              Cancel
            </Button>
            <Button
              raised
              color="primary"
              disabled={!this.state.selectedPackage.id}
              onTouchTap={this.updateUserPackages}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default graphql(UPDATE_USER_PACKAGES_MUTATION, {
  name: "updateUserPackages"
})(KanbanBoardContainer);
