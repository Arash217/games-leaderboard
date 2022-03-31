import styles from './Ladder.module.scss'
import classNames from 'classnames'
import isEven from '../../lib/isEven'
import { useContext } from 'react'
import PlayerRanksContext from '../../store/PlayerRanksContext'

export default function Ladder() {
  const playerRanksCtx = useContext(PlayerRanksContext)

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
              <div className={styles.player} key={playerRank.id}>
                <span>{playerRank.player.name}</span>
              </div>
            ))}
          </div>
        </li>
      ))}
    </ul>
  )
}
