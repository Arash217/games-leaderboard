import { createContext } from 'react'

const CompetitionsContext = createContext({
  competitions: [],
  set: (competitions) => {},
  add: (competition) => {},
  update: (competition) => {},
  remove: (id) => {},
})

export default CompetitionsContext
