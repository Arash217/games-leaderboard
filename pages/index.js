import Modal from '../components/Modal'
import { useState, useContext, useEffect } from 'react'
import CompetitionList from '../components/CompetitionList'
import prisma from '../lib/prisma'
import CompetitionsContext from '../store/CompetitionsContext'
import CompetitionForm from '../components/CompetitionForm'
import SearchBar from '../components/SearchBar'

export default function Home({ competitions }) {
  const competitionsCtx = useContext(CompetitionsContext)
  const [modalShown, setModalShown] = useState(false)
  const [filteredCompetitions, setFilteredCompetitions] = useState(competitions)

  useEffect(() => {
    competitionsCtx.set(competitions)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [competitions])

  useEffect(() => {
    setFilteredCompetitions(competitionsCtx.competitions)
  }, [competitionsCtx.competitions])

  function handleFilter(e) {
    const filtered = competitionsCtx.competitions.filter((competition) =>
      competition.name.includes(e.target.value)
    )
    setFilteredCompetitions(filtered)
  }

  function handleModalClose() {
    setModalShown(false)
  }

  function handleModalOpen() {
    setModalShown(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const { name, image } = e.target

    try {
      const res = await fetch('/api/competitions', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          name: name.value,
          image: image.value,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message)
      }

      setModalShown(false)
      competitionsCtx.add(data)
    } catch (err) {
      console.log(err.message)
    }
  }

  return (
    <div>
      <button className={'button'} onClick={handleModalOpen}>
        Create Competition
      </button>

      <SearchBar onSearch={handleFilter} />

      <CompetitionList competitions={filteredCompetitions} />

      {modalShown && (
        <Modal title='Create competition' onClose={handleModalClose}>
          <CompetitionForm onSubmit={handleSubmit} buttonText={'Create'} />
        </Modal>
      )}
    </div>
  )
}

export async function getServerSideProps() {
  const competitions = await prisma.competition.findMany({
    orderBy: [
      {
        createdAt: 'asc'
      }
    ]
  })

  return {
    props: {
      competitions: competitions.map(competition => ({
        ...competition,
        createdAt: competition.createdAt.toISOString(),
        updatedAt: competition.updatedAt.toISOString()
      }))
    },
  }
}
