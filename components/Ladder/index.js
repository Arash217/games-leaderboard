import styles from './Ladder.module.scss'
import classNames from 'classnames'
import isEven from '../../lib/isEven'
import isPlayer from '../../lib/isPlayer'
import { useContext } from 'react'
import PlayerRanksContext from '../../store/PlayerRanksContext'
import { useUser } from '@auth0/nextjs-auth0'

export default function Ladder() {
  const playerRanksCtx = useContext(PlayerRanksContext)
  const userCtx = useUser()

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
              <div className={classNames(styles.player)} key={playerRank.id}>
                {isPlayer(playerRank, userCtx) && (
                  <div className={styles.highlight} />
                )}
                <span className={styles['player-name']}>
                  {playerRank.player.name}
                </span>
              </div>
            ))}
          </div>
        </li>
      ))}
    </ul>
  )
}
