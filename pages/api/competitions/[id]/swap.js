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

    const { challengeeId } = req.body

    const foundChallengeeRank = await prisma.playerRank.findFirst({
      where: {
        competitionId: req.query.id,
        playerId: challengeeId,
      },
    })

    if (!foundChallengeeRank) {
      return res.status(400).json({
        message: `Challengee is not in this competition`,
      })
    }

    if (foundPlayerRank.rank - foundChallengeeRank.rank !== 1) {
      return res.status(400).json({
        message: `Challenger can only challenge exactly 1 rank above themselves`,
      })
    }

    const [challengerPlayerRank, challengeePlayerRank] =
      await prisma.$transaction([
        prisma.playerRank.update({
          where: {
            id: foundPlayerRank.id,
          },
          data: {
            rank: foundChallengeeRank.rank,
          },
        }),
        prisma.playerRank.update({
          where: {
            id: foundChallengeeRank.id,
          },
          data: {
            rank: foundPlayerRank.rank,
          },
        }),
      ])

    res.json({
      challengerPlayerRankId: challengerPlayerRank.id,
      challengeePlayerRankId: challengeePlayerRank.id,
    })
  } catch (err) {
    console.log(err)
    res.status(400).json({
      message: 'Something went wrong',
    })
  }
}
