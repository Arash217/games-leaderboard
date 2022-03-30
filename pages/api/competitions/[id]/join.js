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

  if (foundPlayerRank) {
    return res.status(400).json({
      message: `Player is already in this competition`,
    })
  }

  const [lowestPlayerRank] = await prisma.playerRank.findMany({
    where: {
      competitionId: req.query.id,
    },
    orderBy: {
      rank: 'desc',
    },
    take: 1,
  })

  if (!lowestPlayerRank) {
    const createdPlayerRank = await prisma.playerRank.create({
      data: {
        competitionId: req.query.id,
        playerId: player.id,
        rank: 1
      },
    })

    return res.json(createdPlayerRank)
  }

  const playersInLowestPlayerRank = await prisma.playerRank.count({
    where: {
      competitionId: req.query.id,
      rank: lowestPlayerRank.rank,
    },
  })

  let playerRank

  if (lowestPlayerRank && lowestPlayerRank.rank > playersInLowestPlayerRank) {
    playerRank = lowestPlayerRank.rank
  } else {
    playerRank = lowestPlayerRank.rank + 1
  }

  const createdPlayerRank = await prisma.playerRank.create({
    data: {
      competitionId: req.query.id,
      playerId: player.id,
      rank: playerRank
    },
  })

  return res.json(createdPlayerRank)
}
