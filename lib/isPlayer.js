export default function isPlayer(playerRank, userCtx) {
  return playerRank.player.googleUserId === userCtx?.user?.sub
}
