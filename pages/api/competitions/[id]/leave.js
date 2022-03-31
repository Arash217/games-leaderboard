import prisma from '../../../../lib/prisma'
import { getSession } from '@auth0/nextjs-auth0'

export default async function handle(req, res) {
  switch (req.method) {
    case 'POST':
      handlePOST(req, res)
      break
    default:
      res.status(400).json({
        message: `The HTTP ${req.method} method is not supported at this route.`,
      })
  }
}

async function handlePOST(req, res) {
  try {
    const competition = await prisma.competition.findUnique({
      where: { id: req.query.id },
      include: {
        PlayerRanks: {
          include: {
            player: true,
          },
        },
      },
    })

    if (!competition) {
      return res.status(404).json({
        message: 'Competition not found',
      })
    }

    const session = getSession(req, res)

    const player = await prisma.player.findFirst({
      where: {
        googleUserId: session.user.sub,
      },
    })

    const foundPlayerRank = await prisma.playerRank.findFirst({
      where: {
        competitionId: req.query.id,
        playerId: player.id,
      },
    })

    if (!foundPlayerRank) {
      return res.status(400).json({
        message: `Player is not in this competition`,
      })
    }

    const playerRanks = competition.PlayerRanks.sort((a, b) => a.rank - b.rank)

    const playerRankIndex = playerRanks.findIndex(
      (playerRank) => playerRank.playerId === player.id
    )
    const toBeUpdatedPlayerRanks = []

    for (let i = playerRanks.length - 1; i > playerRankIndex; i--) {
      const currentPlayerRank = playerRanks[i]
      const previousPlayerRank = playerRanks[i - 1]
      currentPlayerRank.rank = previousPlayerRank.rank
      toBeUpdatedPlayerRanks.push(currentPlayerRank)
    }

    const deletedPlayerRank = await prisma.playerRank.delete({
      where: {
        id: playerRanks[playerRankIndex].id,
      },
    })

    await Promise.all(
      toBeUpdatedPlayerRanks.map((playerRank) => {
        return prisma.playerRank.update({
          where: {
            id: playerRank.id,
          },
          data: {
            rank: playerRank.rank,
          },
        })
      })
    )

    return res.json(deletedPlayerRank)
  } catch (err) {
    console.log(err)
    return res.json({
      message: 'Something went wrong',
    })
  }
}
