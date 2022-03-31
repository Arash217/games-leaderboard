import prisma from '../../../../lib/prisma'

export default async function handle(req, res) {
  switch (req.method) {
    case 'GET':
      handleGET(req, res)
      break
    case 'PATCH':
      handlePATCH(req, res)
      break
    case 'DELETE':
      handleDELETE(req, res)
      break
    default:
      res.status(400).json({
        message: `The HTTP ${req.method} method is not supported at this route.`,
      })
  }
}

async function handleGET(req, res) {
  const competition = await prisma.competition.findUnique({
    where: { id: req.query.id },
    include: { PlayerRanks: true },
  })

  if (!competition) {
    return res.status(404).json({
      message: 'Competition not found',
    })
  }

  res.json(competition)
}

async function handlePATCH(req, res) {
  const { name, image } = req.body

  if (!name) {
    return res.status(400).json({
      message: `Field 'name' is required`,
    })
  }

  if (!image) {
    return res.status(400).json({
      message: `Field 'image' is required`,
    })
  }

  try {
    const competition = await prisma.competition.update({
      where: { id: req.query.id },
      data: {
        name,
        image,
      },
    })

    res.json(competition)
  } catch (err) {
    switch (err.code) {
      case 'P2025':
        res.status(404).json({
          message: 'Competition not found',
        })
        break
    }
  }
}

async function handleDELETE(req, res) {
  try {
    const { id } = await prisma.competition.delete({
      where: { id: req.query.id },
    })

    res.json({ id })
  } catch (err) {
    console.log(err)
    switch (err.code) {
      case 'P2025':
        res.status(404).json({
          message: 'Competition not found',
        })
        break
      default:
        res.status(400).json({
          message: 'Something went wrong',
        })
    }
  }
}
