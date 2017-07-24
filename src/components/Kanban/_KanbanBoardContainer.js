import React, { Component } from "react";
import update from "immutability-helper";
import { graphql, compose } from "react-apollo";
import Button from "material-ui/Button";
import AddIcon from "material-ui-icons/Add";
import throttle from "lodash/throttle";
import find from "lodash/find"
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from "material-ui/Dialog";
import { LabelRadio } from "material-ui/Radio";
import Grid from "material-ui/Grid";
import Tabs, { Tab } from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import Select from 'react-select';

import KanbanBoard from "./_KanbanBoard";
import SearchPackages from "./_SearchPackages";

import ADD_USER_TO_PACKAGE from "../../mutations/addUserToPackage";
import REMOVE_USER_FROM_PACKAGE from "../../mutations/removeUserFromPackage";
import UPDATE_USER_KANBAN_LAYOUTS from '../../mutations/updateUserKanbanLayouts';
import UPDATE_USER_KANBAN_BOARDS from "../../mutations/updateUserKanbanBoards";
import FETCH_CURRENT_USER from '../../queries/user';

import 'react-select/dist/react-select.css';

class KanbanBoardContainer extends Component {
  state = {
    cards: this.props.cards,
    kanbanBoards: this.props.user.kanbanBoards,
    kanbanLayouts: this.props.user.kanbanLayouts,
    isAddPackageModalOpen: false,
    isAddBoardModalOpen: false,
    addBoardName: "",
    selectedList: "",
    selectedBoard: "",
    selectedPackage: {},
    tabIndex: 0,
    currentBoard: "All"
  };

  _handlePackageModalOpen = () => {
    this.setState({ isAddPackageModalOpen: true });
  };

  _closePackageModal = () => {
    this.setState({ isAddPackageModalOpen: false });
  };

  _handleListSelection = e => {
    this.setState({ selectedList: e.target.value });
  };

  _handleBoardSelection = option => {
    this.setState({ selectedBoard: option.value });
  };

  _handlePackageSelection = (pkg) => {
    this.setState({ selectedPackage: pkg });
  };

  _handleAddPackage = async () => {
    let { cards, selectedList, selectedBoard } = this.state
    let pkg = this.state.selectedPackage

    try {
      await this.props.addUserToPackage({
        variables: {
          userId: this.props.user.id,
          packageId: pkg.id,
        },
      });

      pkg.board = selectedBoard
      pkg.list = selectedList

      cards = [...cards, pkg]
      this.setState({ cards }, this._updateUserKanbanLayouts)
    } catch (e) {
      console.error(e.message);
    }
  };

  _handleRemovePackage = async (pkgId, pkgName, pkgBoard) => {
    let { cards } = this.state

    try {
      await this.props.removeUserFromPackage({
        variables: {
          userId: this.props.user.id,
          packageId: pkgId
        },
      });

      cards = [...cards].filter(card => card.id !== pkgId)
      this.setState({ cards }, this._updateUserKanbanLayouts)
    } catch (e) {
      console.error(e.message);
    }
  };

  _formatKanbanLayouts = (useState) => {
    const { cards } = this.state;
    let kanbanLayouts = [];

    for (let index in cards) {
      const { name, board, list } = cards[index];
      kanbanLayouts.push({ name, board, list });
    }
    return kanbanLayouts;
  };

  _updateUserKanbanLayouts = async () => {
    console.log('updating kanban board layouts')
    try {
      await this.props.updateUserKanbanLayouts({
        variables: { 
          id: this.props.user.id, 
          kanbanLayouts: this._formatKanbanLayouts()
        },
        refetchQueries: [{ query: FETCH_CURRENT_USER }]
      });
      console.log('updated kanban board layouts')
      this._closePackageModal()
    } catch (e) {
      console.error(e.message);
    }
  };

  updateCardList = (cardId, listId) => {
    // Find the index of the card
    let cardIndex = this.state.cards.findIndex(card => card.id === cardId);
    // Get the current card
    let card = this.state.cards[cardIndex];
    // Only proceed if hovering over a different list
    if (card.list !== listId) {
      // set the component state to the mutated object
      this.setState(
        update(this.state, {
          cards: {
            [cardIndex]: {
              list: { $set: listId }
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

  _handleTabChange = (event, tabIndex) => {
    const currentBoard = this.props.user.kanbanBoards[tabIndex];
    const cards = this.props.cards;

    this.setState({ tabIndex, currentBoard, cards });
  };

  _handleAddBoardModalOpen = () => {
    this.setState({ isAddBoardModalOpen: true });
  };

  _handleAddBoardModalClose = () => {
    this.setState({ isAddBoardModalOpen: false });
  };

  _handleAddBoardNameChange = e => {
    this.setState({ addBoardName: e.target.value });
  };

  _handleAddBoard = async () => {
    const { user, updateUserKanbanBoards } = this.props;
    console.log(`adding ${this.state.addBoardName} to user boards`);

    try {
      const response = await updateUserKanbanBoards({
        variables: {
          id: user.id,
          kanbanBoards: [...user.kanbanBoards, this.state.addBoardName]
        },
        update: (store, { data: { updateUser } }) => {
          const kanbanBoards = updateUser.kanbanBoards;
          store.writeQuery({
            query: FETCH_CURRENT_USER,
            data: { 
              user: {
                ...user, kanbanBoards
              }
             }
          });
        }
      });
      
      const boards = response.data.updateUser.kanbanBoards;
      const tabIndex = boards.length - 1;
      const currentBoard = boards[tabIndex];

      this.setState({ 
        tabIndex, 
        currentBoard, 
        addBoardName: "", 
        isAddBoardModalOpen: false 
      });
    } catch (e) {
      console.error(e.message);
      this.setState({ addBoardName: "", isAddBoardModalOpen: false });
    }
  };

  _handleRemoveBoard = async () => {
    const currentBoard = this.state.currentBoard;
    const boardNotEmpty = find(this.state.cards, { board: currentBoard })
    if (boardNotEmpty) return  alert('Remove packages from board')

    try {
      await this.props.updateUserKanbanBoards({
        variables: {
          id: this.props.user.id,
          kanbanBoards: [...this.props.user.kanbanBoards].filter(board => {
            return board !== currentBoard;
          })
        },
        update: (store, { data: { updateUser } }) => {
          const kanbanBoards = updateUser.kanbanBoards;
          store.writeQuery({
            query: FETCH_CURRENT_USER,
            data: { 
              user: {
                ...this.props.user, kanbanBoards
              }
             }
          });
        }
      });
      this.setState({ tabIndex: 0, currentBoard: "All" });
    } catch (e) {
      console.error(e.message);
      this.setState({ tabIndex: 0, currentBoard: "All" });
    }
  };

  _formatBoardSelectItems = () => {
    const { kanbanBoards } = this.props.user;
    const arr = [];

    for (let item in kanbanBoards) {
      const board = kanbanBoards[item];
      arr.push({ label: board, value: board });
    }
    return arr;
  };

  render() {
    const { user } = this.props;
    const boardSelectOptions = this._formatBoardSelectItems();

    return (
      <div>
        <Grid container>
          <Grid item xs={9} style={{ paddingTop: 0 }}>
            <Tabs
              index={this.state.tabIndex}
              onChange={this._handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              scrollable
              scrollButtons="auto"
              style={{ marginBottom: "20px" }}
            >
              {user.kanbanBoards.map(board => {
                return <Tab key={board} label={board} />;
              })}
            </Tabs>
          </Grid>
          <Grid item xs={3}>
            <Grid direction="row" container justify="flex-end">
              <Grid item>
                {false &&
                  <Button raised style={{ marginRight: "10px" }}>
                    Subscribe
                  </Button>}
                {this.state.currentBoard !== "All" &&
                  <Button
                    raised
                    onClick={this._handleRemoveBoard}
                    style={{ marginRight: "10px" }}
                  >
                    Remove Board
                  </Button>}
                <Button raised onClick={this._handleAddBoardModalOpen}>
                  Add Board
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <KanbanBoard
          cards={this.state.cards}
          cardCallbacks={{
            updateStatus: throttle(this.updateCardList),
            updatePosition: throttle(this.updateCardPosition, 500),
            persistCardDrag: this._updateUserKanbanLayouts,
            removeCard: this._handleRemovePackage
          }}
          currentBoard={this.state.currentBoard}
        />
        <Button
          fab
          color="primary"
          style={{ position: "fixed", bottom: "20px", right: "20px" }}
          onClick={this._handlePackageModalOpen}
        >
          <AddIcon />
        </Button>

        {/* Add Board */}
        <Dialog
          open={this.state.isAddBoardModalOpen}
          onRequestClose={this._handleAddBoardModalClose}
        >
          <DialogTitle>Add Board</DialogTitle>
          <DialogContent style={{ width: "500px", marginBottom: "20px" }}>
            <TextField
              autoFocus
              type="text"
              InputProps={{ placeholder: "Add Board Name" }}
              style={{ width: "100%" }}
              marginForm
              onChange={e => this._handleAddBoardNameChange(e)}
              value={this.state.addBoardName}
            />
          </DialogContent>
          <DialogActions>
            <Button className="mr3" onTouchTap={this._handleAddBoardModalClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              raised
              color="primary"
              disabled={!this.state.addBoardName}
              onTouchTap={this._handleAddBoard}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Package */}
        <Dialog
          open={this.state.isAddPackageModalOpen}
          onRequestClose={this._handlePackageModal}
        >
          <DialogTitle>Add Package</DialogTitle>
          <DialogContent style={{ width: "500px", marginBottom: "30px" }}>
            <Select
              options={boardSelectOptions}
              placeholder="Select Board"
              value={this.state.selectedBoard}
              onChange={this._handleBoardSelection}
              autofocus
              style={{ marginBottom: "20px" }}
            />
            <div style={{ marginBottom: "20px" }}>
              <LabelRadio
                label="Backlog"
                value="backlog"
                checked={this.state.selectedList === "backlog"}
                onChange={this._handleListSelection}
              />
              <LabelRadio
                label="Staging"
                value="staging"
                checked={this.state.selectedList === "staging"}
                onChange={this._handleListSelection}
              />
              <LabelRadio
                label="Production"
                value="production"
                checked={this.state.selectedList === "production"}
                onChange={this._handleListSelection}
              />
              <LabelRadio
                label="Archive"
                value="archive"
                checked={this.state.selectedList === "archive"}
                onChange={this._handleListSelection}
              />
            </div>
            <SearchPackages
              _handlePackageSelection={this._handlePackageSelection}
              selectedBoard={this.state.selectedBoard}
              selectedList={this.state.selectedList}
            />
          </DialogContent>
          <DialogActions>
            <Button className="mr3" onTouchTap={this._closePackageModal}>
              Cancel
            </Button>
            <Button
              raised
              color="primary"
              disabled={
                !this.state.selectedList || 
                  !this.state.selectedBoard ||
                    !Object.keys(this.state.selectedPackage).length
              }
              onTouchTap={this._handleAddPackage}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default compose(
  graphql(ADD_USER_TO_PACKAGE, { name: "addUserToPackage" }),
  graphql(REMOVE_USER_FROM_PACKAGE, { name: "removeUserFromPackage" }),
  graphql(UPDATE_USER_KANBAN_LAYOUTS, { name: "updateUserKanbanLayouts" }),
  graphql(UPDATE_USER_KANBAN_BOARDS, { name: "updateUserKanbanBoards" })
)(KanbanBoardContainer)