import styles from './CompetitionList.module.scss'
import CompetitionKebabMenu from './CompetitionKebabMenu'
import Link from 'next/link'

export default function CompetitionItem({ competition }) {
  return (
    <li>
      <Link href={`/competition/${competition.id}`}>
        <a>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={competition.image}
            alt={competition.name}
            className={styles.image}
          />
        </a>
      </Link>
      <CompetitionKebabMenu competition={competition} />
    </li>
  )
}
