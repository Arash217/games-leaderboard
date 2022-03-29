import prisma from '../../../lib/prisma'

export default async function handle(req, res) {
  try {
    const { user: { name, user_id } } = JSON.parse(req.body)
    await prisma.player.create({
      data: {
        name,
        googleUserId: user_id
      }
    })
  } catch (err) {
    console.log(err)
  } finally {
    await prisma.$disconnect();
    res.send({ received: true })
  }
}