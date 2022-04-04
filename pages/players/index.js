import prisma from '../../lib/prisma'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import PlayersList from '../../components/PlayersList/Index'
import SearchBar from '../../components/SearchBar'
import { useState } from 'react'

export default function Players({ players }) {
  const [filteredPlayers, setFilteredPlayers] = useState(players)

  function handleFilter(e) {
    const filtered = players.filter((player) =>
      player.name.includes(e.target.value)
    )
    setFilteredPlayers(filtered)
  }

  return (
    <div>
      <h1 className={'h1'}>Players</h1>

      <SearchBar onSearch={handleFilter} placeholder='Filter Players...' />

      <PlayersList players={filteredPlayers} />
    </div>
  )
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(_) {
    const players = await prisma.player.findMany()

    return {
      props: {
        players,
      },
    }
  },
})
