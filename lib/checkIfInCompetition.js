export default function checkIfInCompetition(playerRanks, session) {
  const player = playerRanks.find((playerRank) => {
    return playerRank.player.googleUserId === session?.user?.sub
  })

  if (player) {
    return true
  }

  return false
}