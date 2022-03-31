import prisma from '../../lib/prisma'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import styles from './Competition.module.scss'
import classNames from 'classnames'
import Ladder from '../../components/Ladder'
import { getSession, useUser } from '@auth0/nextjs-auth0'
import { useState, useEffect, useContext } from 'react'
import checkIfInCompetition from '../../lib/checkIfInCompetition'
import PlayerRanksContext from '../../store/PlayerRanksContext'

export default function Competition({
  competition,
  isInCompetition: _isInCompetition,
}) {
  const playerRanksCtx = useContext(PlayerRanksContext)
  const [isInCompetition, setIsInCompetition] = useState(_isInCompetition)
  const userCtx = useUser()

  useEffect(() => {
    if (checkIfInCompetition(playerRanksCtx.playerRanks, userCtx)) {
      setIsInCompetition(true)
    } else {
      setIsInCompetition(false)
    }
  }, [isInCompetition, playerRanksCtx.playerRanks, userCtx])

  useEffect(() => {
    playerRanksCtx.set(competition.PlayerRanks)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleJoinCompetition() {
    try {
      const res = await fetch(`/api/competitions/${competition.id}/join`, {
        method: 'POST',
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message)
      }

      playerRanksCtx.add(data)
    } catch (err) {
      console.log(err.message)
    }
  }

  async function handleLeaveCompetition() {
    try {
      const res = await fetch(`/api/competitions/${competition.id}/leave`, {
        method: 'POST',
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message)
      }

      playerRanksCtx.remove(data.id)
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

      <Ladder />
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

    const session = getSession(ctx.req, ctx.res)
    const isInCompetition = checkIfInCompetition(
      competition.PlayerRanks,
      session
    )

    return {
      props: {
        competition,
        isInCompetition,
      },
    }
  },
})
