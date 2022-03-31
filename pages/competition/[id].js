import prisma from '../../lib/prisma'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import styles from './Competition.module.scss'
import classNames from 'classnames'
import Ladder from '../../components/Ladder'
import { getSession, useUser } from '@auth0/nextjs-auth0'
import { useState, useEffect } from 'react'

function checkIfInCompetition(competition, session) {
  const player = competition.PlayerRanks.find((playerRank) => {
    return playerRank.player.googleUserId === session?.user?.sub
  })

  if (player) {
    return true
  }

  return false
}

export default function Competition({
  competition,
  isInCompetition: _isInCompetition,
}) {
  const [isInCompetition, setIsInCompetition] = useState(_isInCompetition)
  const userCtx = useUser()

  useEffect(() => {
    if (checkIfInCompetition(competition, userCtx)) {
      setIsInCompetition(true)
    }
  }, [competition, isInCompetition, userCtx])

  async function handleJoinCompetition() {
    try {
      const res = await fetch(`/api/competitions/${competition.id}/join`, {
        method: 'POST'
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message)
      }
    } catch (err) {
      console.log(err.message)
    }
  }

  async function handleLeaveCompetition() {
    try {
      const res = await fetch(`/api/competitions/${competition.id}/leave`, {
        method: 'POST'
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message)
      }
    } catch (err) {
      console.log(err.message)
    }
  }

  return (
    <div>
      <h1 className={'h1'}>{competition.name}</h1>

      {!isInCompetition ? (
        <button
          className={classNames('button', styles.join)}
          onClick={handleJoinCompetition}
        >
          Join Competition
        </button>
      ) : (
        <button
          className={classNames('button', styles.leave)}
          onClick={handleLeaveCompetition}
        >
          Leave Competition
        </button>
      )}

      <Ladder competition={competition} />
    </div>
  )
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const competition = await prisma.competition.findUnique({
      where: {
        id: ctx.query.id,
      },
      include: {
        PlayerRanks: {
          include: {
            player: true,
          },
        },
      },
    })

    if (!competition) {
      return {
        props: {
          errorCode: 404,
        },
      }
    }

    competition.PlayerRanks = competition.PlayerRanks.sort(
      (a, b) => a.rank - b.rank
    )

    const groupedPlayerRanks = []

    competition.PlayerRanks.forEach((playerRank) => {
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

    competition.groupedPlayerRanks = groupedPlayerRanks

    const session = getSession(ctx.req, ctx.res)
    const isInCompetition = checkIfInCompetition(competition, session)

    return {
      props: {
        competition,
        isInCompetition,
      },
    }
  },
})
