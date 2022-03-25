import { useReducer } from 'react'
import CompetitionsContext from './CompetitionsContext'

const defaultState = {
  competitions: [],
}

const competitionsReducer = (state, action) => {
  if (action.type === 'SET') {
    return { competitions: action.competitions }
  }

  if (action.type === 'ADD') {
    return { competitions: [...state.competitions, action.competition] }
  }

  if (action.type === 'UPDATE') {
    const competitionIndex = state.competitions.findIndex(
      (competition) => competition.id === action.competition.id
    )
    const updatedCompetitions = [...state.competitions]
    updatedCompetitions[competitionIndex] = action.competition

    return { competitions: updatedCompetitions }
  }

  if (action.type === 'REMOVE') {
    const updatedCompetitions = state.competitions.filter(
      (competition) => competition.id !== action.id
    )

    return { competitions: updatedCompetitions }
  }

  return defaultState
}

const CompetitionsProvider = ({ children }) => {
  const [competitionsState, dispatchCompetitionsAction] = useReducer(
    competitionsReducer,
    defaultState
  )

  const setCompetitionsHandler = (competitions) => {
    dispatchCompetitionsAction({
      type: 'SET',
      competitions,
    })
  }

  const addCompetitionHandler = (competition) => {
    dispatchCompetitionsAction({
      type: 'ADD',
      competition,
    })
  }

  const updateCompetitionHandler = (competition) => {
    dispatchCompetitionsAction({
      type: 'UPDATE',
      competition,
    })
  }

  const removeCompetitionHandler = (id) => {
    dispatchCompetitionsAction({
      type: 'REMOVE',
      id,
    })
  }

  const competitionsContext = {
    competitions: competitionsState.competitions,
    set: setCompetitionsHandler,
    add: addCompetitionHandler,
    update: updateCompetitionHandler,
    remove: removeCompetitionHandler,
  }

  return (
    <CompetitionsContext.Provider value={competitionsContext}>
      {children}
    </CompetitionsContext.Provider>
  )
}

export default CompetitionsProvider
