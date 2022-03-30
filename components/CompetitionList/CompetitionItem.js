import styles from './CompetitionList.module.scss'
import CompetitionKebabMenu from './CompetitionKebabMenu'

export default function CompetitionItem({ competition }) {
  return (
    <li>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={competition.image}
        alt={competition.name}
        className={styles.image}
      />
      <CompetitionKebabMenu competition={competition} />
    </li>
  )
}