import { createContext } from 'react'

const PlayerRanksContext = createContext({
  playerRanks: [],
  set: (competitions) => {},
  add: (competition) => {},
  swap: (challengerPlayerRankId, challengeePlayerRankId) => {}
})

export default PlayerRanksContext
