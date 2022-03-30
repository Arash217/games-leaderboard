import styles from './Ladder.module.scss'
import classNames from 'classnames'
import isEven from '../../lib/isEven'

export default function Ladder({ competition }) {
  return (
    <ul className={styles.ladder}>
      {competition.groupedPlayerRanks.map((groupedPlayerRank, index) => (
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
