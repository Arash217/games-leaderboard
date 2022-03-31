import { createContext } from 'react'

const PlayerRanksContext = createContext({
  playerRanks: [],
  set: (competitions) => {},
  add: (competition) => {},
})

export default PlayerRanksContext
