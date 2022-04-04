import styles from './Ladder.module.scss'
import classNames from 'classnames'
import isEven from '../../lib/isEven'
import isPlayer from '../../lib/isPlayer'
import { useContext, useMemo } from 'react'
import PlayerRanksContext from '../../store/PlayerRanksContext'
import { useUser } from '@auth0/nextjs-auth0'
import ChallengeButton from './ChallengeButton'

function isChallengeable(challenger, challengee) {
  return challenger?.rank - challengee?.rank === 1
}

export default function Ladder({ competition }) {
  const playerRanksCtx = useContext(PlayerRanksContext)
  const userCtx = useUser()

  const player = useMemo(() => {
    return playerRanksCtx.playerRanks.find(
      (playerRank) => playerRank.player.googleUserId === userCtx?.user?.sub
    )
  }, [playerRanksCtx.playerRanks, userCtx?.user?.sub])

  return (
    <ul className={styles.ladder}>
      {playerRanksCtx.groupedPlayerRanks.map((groupedPlayerRank, index) => (
        <li key={index}>
          <div
            className={classNames(
              styles.rank,
              isEven(index + 1) && styles.even
            )}
          >
            {index + 1}
          </div>
          <div className={styles.players}>
            {groupedPlayerRank.map((playerRank) => (
              <div key={playerRank.id} className={styles.playerContainer}>
                <div className={classNames(styles.player)}>
                  {playerRank.playerId === player?.playerId && (
                    <div className={styles.highlight} />
                  )}
                  <span className={styles.playerName}>
                    {playerRank.player.name}
                  </span>
                </div>
                {isChallengeable(player, playerRank) && (
                  <ChallengeButton competition={competition} challenger={player} challengee={playerRank} />
                )}
              </div>
            ))}
          </div>
        </li>
      ))}
    </ul>
  )
}
