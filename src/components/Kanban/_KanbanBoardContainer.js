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
  DialogTitle,
} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

import KanbanBoard from "./_KanbanBoard";
import UPDATE_USER_PACKAGES_MUTATION from "../../mutations/updateUserPackages";

class KanbanBoardContainer extends Component {
  state = {
    cards: this.props.cards,
    isAddPackageModalOpen: false,
    packageSearchText: ''
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
    } catch (e) {
      console.error(e);
    }
  };

  _handleAddPackageModal = () => {
    this.setState({ isAddPackageModalOpen: !this.state.isAddPackageModalOpen })
  }

  _handlePackageSearchChange = (text) => {
    this.setState({ packageSearchText: text })
  }

  render() {
    return (
      <div>
        <KanbanBoard
          cards={this.state.cards}
          cardCallbacks={{
            updateStatus: throttle(this.updateCardStatus),
            updatePosition: throttle(this.updateCardPosition, 500),
            persistCardDrag: this.updateUserPackages
          }}
        />
        <Button 
          fab 
          color="primary" 
          style={{ position: 'fixed', bottom: '20px', right: '20px' }}
          onClick={this._handleAddPackageModal}
        >
          <AddIcon />
        </Button>
        <Dialog
            open={this.state.isAddPackageModalOpen}
            onRequestClose={this._handleAddPackageModal}
          >
           <DialogTitle>Add Package</DialogTitle>
           <DialogContent style={{ width: '500px' }}>
             <DialogContentText style={{ marginBottom: '10px' }}>
               Enter a Package Name below:
             </DialogContentText>
             <TextField
               autoFocus
               value={this.state.packageSearchText}
               style={{ width: '100%' }}
               onChange={(e) => this._handlePackageSearchChange(e.target.value)}
               InputProps={{ placeholder: 'e.g. react, apollo-client, boto' }}
             />
           </DialogContent>
           <DialogActions>
             <Button
               className='mr3'
               onTouchTap={this._handleAddPackageModal}
             >
               Cancel
            </Button>
             <Button
               raised
               color="primary"
               disabled={!this.state.packageSearchText}
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
