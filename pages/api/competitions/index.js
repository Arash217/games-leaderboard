import prisma from '../../../lib/prisma'

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

  const result = await prisma.competition.create({
    data: {
      name,
      image,
    },
  })

  res.json(result)
}
