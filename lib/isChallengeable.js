export default function isChallengeable(challenger, challengee) {
  return challenger?.rank - challengee?.rank === 1
}