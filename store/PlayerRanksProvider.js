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

  // if (action.type === 'REMOVE') {
  //   const updatedCompetitions = state.competitions.filter(
  //     (competition) => competition.id !== action.id
  //   )

  //   return { competitions: updatedCompetitions }
  // }

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

  const addPlayerRanksHandler = (playerRank) => {
    dispatchPlayerRanksAction({
      type: 'ADD',
      playerRank,
    })
  }

  // const removeCompetitionHandler = (id) => {
  //   dispatchCompetitionsAction({
  //     type: 'REMOVE',
  //     id,
  //   })
  // }

  const playerRanksContext = {
    playerRanks: playerRanksState.playerRanks,
    groupedPlayerRanks,
    set: setPlayerRanksHandler,
    add: addPlayerRanksHandler,
    // update: updateCompetitionHandler,
    // remove: removeCompetitionHandler,
  }

  return (
    <PlayerRanksContext.Provider value={playerRanksContext}>
      {children}
    </PlayerRanksContext.Provider>
  )
}

export default PlayerRanksProvider
