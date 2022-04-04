import Modal from '../components/Modal'
import { useState, useContext, useEffect } from 'react'
import CompetitionList from '../components/CompetitionList'
import prisma from '../lib/prisma'
import CompetitionsContext from '../store/CompetitionsContext'
import CompetitionForm from '../components/CompetitionForm'
import SearchBar from '../components/SearchBar'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import request from '../lib/request'

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
      const data = await request('/api/competitions', {
        method: 'POST',
        body: JSON.stringify({
          name: name.value,
          image: image.value,
        }),
      })

      competitionsCtx.add(data)
      setModalShown(false)
    } catch (err) {
      console.log(err.message)
    }
  }

  return (
    <div>
      <button className={'button'} onClick={handleModalOpen}>
        Create Competition
      </button>

      <SearchBar onSearch={handleFilter} placeholder='Filter Competitions...' />

      <CompetitionList competitions={filteredCompetitions} />

      {modalShown && (
        <Modal title='Create competition' onClose={handleModalClose}>
          <CompetitionForm onSubmit={handleSubmit} buttonText={'Create'} />
        </Modal>
      )}
    </div>
  )
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(_) {
    const competitions = await prisma.competition.findMany({
      orderBy: [
        {
          createdAt: 'asc',
        },
      ],
    })

    return {
      props: {
        competitions
      },
    }
  },
})
