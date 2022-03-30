import prisma from '../../lib/prisma'
import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import styles from './Competition.module.scss'
import classNames from 'classnames'
import Ladder from '../../components/Ladder'

export default function Competition({ competition }) {
  return (
    <div>
      <h1 className={'h1'}>{competition.name}</h1>

      <button className={classNames('button', styles.join)}>
        Join Competition
      </button>

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

    return {
      props: {
        competition,
      },
    }
  },
})
