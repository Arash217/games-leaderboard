import { useReducer, useState, useEffect } from 'react'
import PlayerRanksContext from './PlayerRanksContext'

const defaultState = {
  playerRanks: [],
}

const playerRanksReducer = (state, action) => {
  if (action.type === 'SET') {
    return { playerRanks: action.playerRanks }
  }

  if (action.type === 'ADD') {
    return { playerRanks: [...state.playerRanks, action.playerRank] }
  }

  if (action.type === 'REMOVE') {
    const playerRankIndex = state.playerRanks.findIndex(
      (playerRank) => playerRank.id === action.id
    )

    for (let i = state.playerRanks.length - 1; i > playerRankIndex; i--) {
      const currentPlayerRank = state.playerRanks[i]
      const previousPlayerRank = state.playerRanks[i - 1]
      currentPlayerRank.rank = previousPlayerRank.rank
    }

    state.playerRanks.splice(playerRankIndex, 1)

    return { playerRanks: [...state.playerRanks] }
  }

  return defaultState
}

const PlayerRanksProvider = ({ children }) => {
  const [playerRanksState, dispatchPlayerRanksAction] = useReducer(
    playerRanksReducer,
    defaultState
  )

  const [groupedPlayerRanks, setGroupedPlayerRanks] = useState([])

  useEffect(() => {
    const groupedPlayerRanks = []

    playerRanksState.playerRanks.forEach((playerRank) => {
      const groupedPlayerRank = groupedPlayerRanks.find((groupedPlayerRank) =>
        groupedPlayerRank.find(
          (_playerRank) => _playerRank.rank === playerRank.rank
        )
      )

      if (groupedPlayerRank) {
        groupedPlayerRank.push(playerRank)
      } else {
        groupedPlayerRanks.push([playerRank])
      }
    })

    setGroupedPlayerRanks(groupedPlayerRanks)
  }, [playerRanksState.playerRanks])

  const setPlayerRanksHandler = (playerRanks) => {
    dispatchPlayerRanksAction({
      type: 'SET',
      playerRanks,
    })
  }

  const addPlayerRankHandler = (playerRank) => {
    dispatchPlayerRanksAction({
      type: 'ADD',
      playerRank,
    })
  }

  const removePlayerRankHandler = (id) => {
    dispatchPlayerRanksAction({
      type: 'REMOVE',
      id,
    })
  }

  const playerRanksContext = {
    playerRanks: playerRanksState.playerRanks,
    groupedPlayerRanks,
    set: setPlayerRanksHandler,
    add: addPlayerRankHandler,
    remove: removePlayerRankHandler,
  }

  return (
    <PlayerRanksContext.Provider value={playerRanksContext}>
      {children}
    </PlayerRanksContext.Provider>
  )
}

export default PlayerRanksProvider
