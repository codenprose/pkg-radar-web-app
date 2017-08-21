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
import Radio from "material-ui/Radio";
import Grid from "material-ui/Grid";
import Tabs, { Tab } from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import Select from 'react-select';

import KanbanBoard from "./_KanbanBoard";
import SearchPackages from "./_SearchPackages";

import CURRENT_USER from '../../queries/currentUser'
import CREATE_USER_KANBAN_PACKAGE from '../../mutations/createUserKanbanPackage'
import DELETE_USER_KANBAN_PACKAGE from '../../mutations/deleteUserKanbanPackage'
import UPDATE_KANBAN_PACKAGE_STATUS from '../../mutations/updateKanbanPackageStatus'
import UPDATE_KANBAN_CARD_POSITIONS from '../../mutations/updateKanbanCardPositions';
import UPDATE_USER_KANBAN_BOARDS from "../../mutations/updateUserKanbanBoards";

import 'react-select/dist/react-select.css';

class KanbanBoardContainer extends Component {
  state = {
    cards: this.props.cards,
    kanbanBoards: this.props.user.kanbanBoards,
    isAddPackageModalOpen: false,
    isAddBoardModalOpen: false,
    addBoardName: "",
    selectedStatus: "",
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

  _handleStatusSelection = e => {
    this.setState({ selectedStatus: e.target.value });
  };

  _handleBoardSelection = option => {
    this.setState({ selectedBoard: option.value });
  };

  _handlePackageSelection = (pkg) => {
    this.setState({ selectedPackage: pkg });
  };

  _handleAddPackage = async () => {
    let { cards, selectedStatus, selectedBoard, selectedPackage } = this.state
    let pkg = {
      board: selectedBoard,
      color: selectedPackage._source.color,
      description: selectedPackage._source.description,
      issues: selectedPackage._source.issues,
      language: selectedPackage._source.language,
      ownerAvatar: selectedPackage._source.owner_avatar,
      ownerName: selectedPackage._source.owner_name,
      packageId: selectedPackage._id,
      packageName: selectedPackage._source.package_name,
      stars: selectedPackage._source.stars,
      status: selectedStatus,
      userId: this.props.user.id
    }

    try {
      await this.props.createUserKanbanPackage({
        variables: {
          ownerName: pkg.ownerName,
          packageId: pkg.packageId,
          packageName: pkg.packageName,
          status: selectedStatus,
          userId: pkg.userId,
        },
      });

      cards = [...cards, pkg]
      this.setState({ cards }, this._updateKanbanCardPositions)
    } catch (e) {
      console.error(e.message);
    }
  };

  _handleRemovePackage = async (pkgId) => {
    console.log('removing package')
    let { cards } = this.state

    try {
      await this.props.deleteUserKanbanPackage({
        variables: {
          userId: this.props.user.id,
          packageId: pkgId
        },
      });

      cards = [...cards].filter(card => card.packageId !== pkgId)
      this.setState({ cards }, this._updateKanbanCardPositions)
      console.log('removed package')
    } catch (e) {
      console.error(e.message);
    }
  };

  _formatKanbanCardPositions = (useState) => {
    const { cards } = this.state;
    let kanbanLayouts = [];

    for (let index in cards) {
      const { board, ownerName, packageName } = cards[index];
      kanbanLayouts.push({ board, ownerName, packageName });
    }
    return kanbanLayouts;
  };

  _updateKanbanCardPositions = async () => {
    console.log('updating kanban board layouts')
    try {
      await this.props.updateKanbanCardPositions({
        variables: { 
          username: this.props.user.username, 
          kanbanCardPositions: this._formatKanbanCardPositions()
        },
      });
      console.log('updated kanban board layouts')
      this._closePackageModal()
    } catch (e) {
      console.error(e.message);
    }
  };

  updateCardPositions = (cardId, afterId) => {
    // Only proceed if hovering over a different card
    if (cardId !== afterId) {
      // Find the index of the card
      let cardIndex = this.state.cards.findIndex(card => card.packageId === cardId);
      // Get the current card
      let card = this.state.cards[cardIndex];
      // Find the index of the card the user is hovering over
      let afterIndex = this.state.cards.findIndex(card => card.packageId === afterId);
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

  _updateKanbanPackageStatus = async (packageId) => {
    console.log('updating package status')
    const cardIndex = this.state.cards.findIndex(card => card.packageId === packageId)
    const status = this.state.cards[cardIndex].status

    try {
      await this.props.updateKanbanPackageStatus({
        variables: { packageId, status, userId: this.props.user.id }
      });
      console.log('updated package status')
    } catch (e) {
      console.error(e.message);
    }
  }

  updateCardStatus = (cardId, statusId) => {
    // Find the index of the card
    let cardIndex = this.state.cards.findIndex(card => card.packageId === cardId);
    // Get the current card
    let card = this.state.cards[cardIndex];
    // Only proceed if hovering over a different status
    if (card.status !== statusId) {
      // set the component state to the mutated object
      this.setState(
        update(this.state, {
          cards: {
            [cardIndex]: {
              status: { $set: statusId }
            }
          }
        })
      );
    }
  };

  _handleTabChange = (event, tabIndex) => {
    const { user } = this.props
    const kanbanBoards = user.kanbanBoards.sort()
    const currentBoard = kanbanBoards[tabIndex];
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
    console.log(`adding ${this.state.addBoardName} to user boards`);
    
    const { user, updateUserKanbanBoards } = this.props;
    const kanbanBoards = [...user.kanbanBoards, this.state.addBoardName]

    try {
      await updateUserKanbanBoards({
        variables: { username: user.username, kanbanBoards },
        update: (store, { data: { updateUser } }) => {
          const token = localStorage.getItem('pkgRadarToken')
          // Read the data from our cache for this query.
          const data = store.readQuery({ 
            query: CURRENT_USER,
            variables: { username: user.username, token }
          });
          // Add our comment from the mutation to the end.
          data.currentUser.kanbanBoards = updateUser.user.kanbanBoards;
          console.log('data', data)
          // Write our data back to the cache.
          store.writeQuery({ query: CURRENT_USER, data });
        },
      });
      
      const tabIndex = kanbanBoards.length - 1;
      const currentBoard = kanbanBoards[tabIndex];

      this.setState({ 
        tabIndex, 
        currentBoard, 
        addBoardName: "", 
        isAddBoardModalOpen: false 
      });
      console.log('updated user kanban boards')
    } catch (e) {
      console.error(e.message);
      this.setState({ addBoardName: "", isAddBoardModalOpen: false });
    }
  };

  _handleRemoveBoard = async () => {
    console.log('removing kanban board')
    const { user } = this.props
    const currentBoard = this.state.currentBoard;
    const packagesOnBoard = find(this.state.cards, { board: currentBoard })
    if (packagesOnBoard) return  alert('Remove packages from current board')

    const kanbanBoards = [...user.kanbanBoards].filter(board => {
      return board !== currentBoard;
    })

    try {
      await this.props.updateUserKanbanBoards({
        variables: { username: user.username, kanbanBoards },
        update: (store, { data: { updateUser } }) => {
          const token = localStorage.getItem('pkgRadarToken')
          // Read the data from our cache for this query.
          const data = store.readQuery({ 
            query: CURRENT_USER,
            variables: { username: user.username, token }
          });
          // Add our comment from the mutation to the end.
          data.currentUser.kanbanBoards = updateUser.user.kanbanBoards;
          console.log('data', data)
          // Write our data back to the cache.
          store.writeQuery({ query: CURRENT_USER, data });
        },
      });
      this.setState({ tabIndex: 0, currentBoard: "All" });
      console.log('removed kanban board')
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
    const kanbanBoards = user.kanbanBoards.sort()
    const boardSelectOptions = this._formatBoardSelectItems()

    console.log('kanban container', this.props)

    return (
      <div>
        <Grid container>
          <Grid item xs={9} style={{ paddingTop: 0 }}>
            <Tabs
              value={this.state.tabIndex}
              onChange={this._handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              scrollable
              scrollButtons="auto"
              style={{ marginBottom: "20px" }}
            >
              {kanbanBoards.map(board => <Tab key={board} label={board} /> )}
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
            updateStatus: this.updateCardStatus,
            updatePosition: throttle(this.updateCardPositions, 500),
            persistCardPositions: this._updateKanbanCardPositions,
            persistPackageStatus: this._updateKanbanPackageStatus,
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
          <DialogContent style={{ width: "550px", marginBottom: "30px" }}>
            <Select
              options={boardSelectOptions}
              placeholder="Select Board"
              value={this.state.selectedBoard}
              onChange={this._handleBoardSelection}
              autofocus
              style={{ marginBottom: "20px" }}
            />
            <div style={{ marginBottom: "20px" }}>
              <Radio
                name="Backlog"
                value="backlog"
                checked={this.state.selectedStatus === "backlog"}
                onChange={this._handleStatusSelection}
              />
              <label style={{ verticalAlign: 'super' }}>Backlog</label>
              <Radio
                name="Trial"
                value="trial"
                checked={this.state.selectedStatus === "trial"}
                onChange={this._handleStatusSelection}
              />
              <label style={{ verticalAlign: 'super' }}>Trial</label>
              <Radio
                name="Production"
                value="production"
                checked={this.state.selectedStatus === "production"}
                onChange={this._handleStatusSelection}
              />
              <label style={{ verticalAlign: 'super' }}>Production</label>
              <Radio
                name="Archive"
                value="archive"
                checked={this.state.selectedStatus === "archive"}
                onChange={this._handleStatusSelection}
              />
              <label style={{ verticalAlign: 'super' }}>Archive</label>
            </div>
            <SearchPackages
              _handlePackageSelection={this._handlePackageSelection}
              selectedBoard={this.state.selectedBoard}
              selectedStatus={this.state.selectedStatus}
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
                !this.state.selectedStatus || 
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
  graphql(CREATE_USER_KANBAN_PACKAGE, { name: 'createUserKanbanPackage' }),
  graphql(DELETE_USER_KANBAN_PACKAGE, { name: "deleteUserKanbanPackage" }),
  graphql(UPDATE_KANBAN_PACKAGE_STATUS, { name: "updateKanbanPackageStatus" }),
  graphql(UPDATE_KANBAN_CARD_POSITIONS, { name: "updateKanbanCardPositions" }),
  graphql(UPDATE_USER_KANBAN_BOARDS, { name: "updateUserKanbanBoards" })
)(KanbanBoardContainer)