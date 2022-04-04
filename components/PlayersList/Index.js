import styles from './PlayersList.module.scss'

export default function PlayersList({ players }) {
  return (
    <ul className={styles.list}>
      {players.map((player) => (
        <li key={player.id}>{player.name}</li>
      ))}
    </ul>
  )
}
