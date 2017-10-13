import React, { Component } from "react";
import update from "immutability-helper";
import { graphql, compose } from "react-apollo";
import Button from "material-ui/Button";
import Icon from 'material-ui/Icon';
import throttle from "lodash/throttle";
import find from "lodash/find"
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle
} from "material-ui/Dialog";
import Grid from "material-ui/Grid";
import Tabs, { Tab } from 'material-ui/Tabs';

import TextField from 'material-ui/TextField';
import Select from 'react-select';
import equal from 'deep-equal'

import KanbanBoard from "./_KanbanBoard";
import { SearchPackages } from '../Shared'

import CURRENT_USER from '../../queries/currentUser'
import CREATE_USER_KANBAN_PACKAGE from '../../mutations/createUserKanbanPackage'
import DELETE_USER_KANBAN_PACKAGE from '../../mutations/deleteUserKanbanPackage'
import UPDATE_KANBAN_PACKAGE_STATUS from '../../mutations/updateKanbanPackageStatus'
import UPDATE_KANBAN_CARDS from '../../mutations/updateKanbanCards';
import UPDATE_USER_KANBAN_BOARDS from "../../mutations/updateUserKanbanBoards";
import USER_KANBAN_PACKAGES from '../../queries/userKanbanPackages'

import 'react-select/dist/react-select.css'

class KanbanBoardContainer extends Component {
  state = {
    cards: this.props.cards,
    kanbanBoards: this.props.user.kanbanBoards,
    isAddPackageModalOpen: false,
    isAddBoardModalOpen: false,
    isAddBoardLoading: false,
    isAddPackageLoading: false,
    addBoardName: "",
    selectedStatus: "",
    selectedBoard: "",
    selectedPackage: {},
    tabIndex: 0,
    currentBoard: "All"
  };

  static defaultProps = {
    kanbanStatusOptions: [
      { label: 'Backlog', value: 'backlog' },
      { label: 'Trial', value: 'trial' },
      { label: 'Production', value: 'production' },
      { label: 'Archive', value: 'archive' }
    ]
  }

  componentWillReceiveProps(nextProps) {
    if (!equal(this.props.cards, nextProps.cards)) {
      this.setState({ cards: nextProps.cards })
    }
  }

  _handlePackageModalOpen = () => {
    this.setState({ isAddPackageModalOpen: true });
  };

  _closePackageModal = () => {
    this.setState({ isAddPackageModalOpen: false });
  };


  _handleBoardSelection = option => {
    if (option) {
      this.setState({ selectedBoard: option.value });
    }
  };

  _handleStatusSelection = option => {
    if (option) {
      this.setState({ selectedStatus: option.value });
    }
  };

  _handlePackageSelection = (pkg) => {
    this.setState({ selectedPackage: pkg });
  };

  _handleAddPackage = async () => {
    this.setState({ isAddPackageLoading: true })
    const { user } = this.props
    const { selectedStatus, selectedBoard, selectedPackage } = this.state
    const { owner_name, package_name } = selectedPackage._source
    let isPkgOnBoard = { name: '', board: '' }

    this.state.cards.forEach(card => {
      if (card.packageName === package_name && card.ownerName === owner_name) {
        isPkgOnBoard.packageName = card.packageName
        isPkgOnBoard.board = card.board
      }
    })

    if (isPkgOnBoard.packageName) {
      return alert('Please first remove package from board')
    }

    try {
      console.log('adding package')
      await this.props.createUserKanbanPackage({
        variables: {
          ownerName: owner_name,
          packageId: selectedPackage._id,
          packageName: package_name,
          status: selectedStatus,
          username: user.username
        },
        refetchQueries: [{
          query: USER_KANBAN_PACKAGES,
          variables: { username: user.username }
        }]
      });
      console.log('added package')

      console.log('updating card positions')
      const token = localStorage.getItem('pkgRadarToken')
      const kanbanCards = this._formatKanbanCards()
      const card = {
        board: selectedBoard,
        ownerName: selectedPackage._source.owner_name,
        packageName: selectedPackage._source.package_name,
      }

      await this.props.updateKanbanCards({
        variables: {
          username: user.username,
          kanbanCards: [...kanbanCards, card]
        },
        refetchQueries: [{
          query: CURRENT_USER,
          variables: { username: user.username, token }
        }]
      });
      console.log('updated card positions')
      this.setState({ isAddPackageLoading: false })
      this._closePackageModal()
    } catch (e) {
      console.error(e.message);
      this.setState({ isAddPackageLoading: false })
      this._closePackageModal()
    }
  };

  _handleRemovePackage = async (pkgId, packageName, currentBoard, status, ownerName) => {
    const { user } = this.props
    const token = localStorage.getItem('pkgRadarToken')

    try {
      console.log('updating card positions')
      let kanbanCards = this._formatKanbanCards()
      kanbanCards = kanbanCards.filter(card => {
        return ownerName !== card.ownerName && packageName !== card.packageName
      })

      await this.props.updateKanbanCards({
        variables: {
          username: user.username,
          kanbanCards
        },
        refetchQueries: [{
          query: CURRENT_USER,
          variables: { username: user.username, token }
        }]
      });
      console.log('updated card positions')

      console.log('removing package')
      await this.props.deleteUserKanbanPackage({
        variables: {
          username: user.username,
          packageId: pkgId
        },
        refetchQueries: [{
          query: USER_KANBAN_PACKAGES,
          variables: { username: user.username }
        }]
      })
      console.log('removed package')
    } catch (e) {
      console.error(e.message);
    }
  };

  _formatKanbanCards = (addTypename) => {
    const { cards } = this.state;
    let kanbanLayouts = [];

    for (let index in cards) {
      const { board, ownerName, packageName } = cards[index];
      const card = { board, ownerName, packageName }
      if (addTypename) card.__typename = 'KanbanCard'
      kanbanLayouts.push(card);
    }
    return kanbanLayouts;
  };

  _updateKanbanCards = async () => {
    const { currentUser } = this.props
    try {
      console.log('updating kanban board layouts')
      await this.props.updateKanbanCards({
        variables: {
          username: currentUser.username,
          kanbanCards: this._formatKanbanCards()
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
    const { currentUser } = this.props
    const cardIndex = this.state.cards.findIndex(card => card.packageId === packageId)
    const status = this.state.cards[cardIndex].status

    try {
      console.log('updating package status')
      await this.props.updateKanbanPackageStatus({
        variables: { username: currentUser.username, packageId, status }
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
    const kanbanBoards = user.kanbanBoards
    const currentBoard = kanbanBoards[tabIndex];

    this.setState({ tabIndex, currentBoard });
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
    this.setState({ isAddBoardLoading: true })

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
        isAddBoardModalOpen: false,
        isAddBoardLoading: false
      });
      console.log('updated user kanban boards')
    } catch (e) {
      console.error(e.message);
      this.setState({ 
        addBoardName: "", 
        isAddBoardModalOpen: false,
        isAddBoardLoading: false
      });
    }
  };

  _handleRemoveBoard = async () => {
    this.setState({ isRemoveBoardLoading: true });
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
          // Write our data back to the cache.
          store.writeQuery({ query: CURRENT_USER, data });
        },
      });
      this.setState({ tabIndex: 0, currentBoard: "All", isRemoveBoardLoading: false });
      console.log('removed kanban board')
    } catch (e) {
      console.error(e.message);
      this.setState({ tabIndex: 0, currentBoard: "All", isRemoveBoardLoading: false });
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

  _handleSwipeChange = index => {
    this.setState({ tabIndex: index });
  };

  render() {
    const { userIsCurrentUser, user } = this.props;
    let { cards, currentBoard } = this.state

    const kanbanBoards = user.kanbanBoards
    const boardSelectOptions = this._formatBoardSelectItems()

    let kanbanBoardWidth = 12
    if (userIsCurrentUser) kanbanBoardWidth = 11

    if (currentBoard !== "All") {
      cards = [...cards].filter(card => card.board === currentBoard)
    }

    return (
      <div style={{ position: 'relative' }}>
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
                {this.state.currentBoard !== "All" && userIsCurrentUser &&
                  <Button
                    raised
                    onClick={this._handleRemoveBoard}
                    disabled={this.state.isRemoveBoardLoading}
                    style={{
                      background: 'firebrick',
                      color: 'white',
                      marginRight: "10px"
                    }}
                  >
                    {this.state.isRemoveBoardLoading &&
                      <i className="fa fa-spinner fa-spin mr1" />}
                    Remove Board
                  </Button>}
                {userIsCurrentUser &&
                  <Button
                    color='primary'
                    raised
                    onClick={this._handleAddBoardModalOpen}
                  >
                    Add Board
                  </Button>}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={kanbanBoardWidth}>
            <KanbanBoard
              cards={cards}
              cardCallbacks={{
                updateStatus: this.updateCardStatus,
                updatePosition: throttle(this.updateCardPositions, 500),
                persistCardPositions: this._updateKanbanCards,
                persistPackageStatus: this._updateKanbanPackageStatus,
                removeCard: this._handleRemovePackage
              }}
              currentBoard={this.state.currentBoard}
              userIsCurrentUser={userIsCurrentUser}
            />
          </Grid>
        </Grid>
        {
          userIsCurrentUser &&
          <Button
            fab
            color="primary"
            style={{ position: "absolute", top: "75px", right: 0 }}
            onClick={this._handlePackageModalOpen}
            autoFocus={false}
          >
            <Icon>add</Icon>
          </Button>
        }

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
            <Button className="mr3" onClick={this._handleAddBoardModalClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              raised
              color="primary"
              disabled={!this.state.addBoardName || this.state.isAddBoardLoading}
              onClick={this._handleAddBoard}
            >
            {this.state.isAddBoardLoading &&
                <i className="fa fa-spinner fa-spin mr1" />}
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Package */}
        <Dialog
          open={this.state.isAddPackageModalOpen}
          onRequestClose={this._closePackageModal}
        >
          <DialogTitle>Add Package</DialogTitle>
          <DialogContent
            style={{
              width: "550px",
              marginBottom: "20px",
              overflowY: 'inherit'
            }}
          >
            <Select
              options={boardSelectOptions}
              placeholder="Select Board"
              value={this.state.selectedBoard}
              onChange={this._handleBoardSelection}
              autofocus
              style={{ marginBottom: "20px" }}
            />
            <Select
              options={this.props.kanbanStatusOptions}
              placeholder="Select Status"
              value={this.state.selectedStatus}
              onChange={this._handleStatusSelection}
              style={{ marginBottom: "30px" }}
            />
            <SearchPackages
              _handlePackageSelection={this._handlePackageSelection}
              selectedBoard={this.state.selectedBoard}
              selectedStatus={this.state.selectedStatus}
            />
          </DialogContent>
          <DialogActions style={{ position: 'relative', zIndex: 1 }}>
            <Button className="mr3" onClick={this._closePackageModal}>
              Cancel
            </Button>
            <Button
              raised
              color="primary"
              disabled={
                !this.state.selectedStatus ||
                  !this.state.selectedBoard ||
                    !Object.keys(this.state.selectedPackage).length ||
                      this.state.isAddPackageLoading
              }
              onClick={this._handleAddPackage}
            >
              {this.state.isAddPackageLoading &&
                <i className="fa fa-spinner fa-spin mr1" />}
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
  graphql(UPDATE_KANBAN_CARDS, { name: "updateKanbanCards" }),
  graphql(UPDATE_USER_KANBAN_BOARDS, { name: "updateUserKanbanBoards" })
)(KanbanBoardContainer)
