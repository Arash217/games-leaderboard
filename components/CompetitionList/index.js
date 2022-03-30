import styles from './CompetitionList.module.scss'
import classNames from 'classnames'
import CompetitionItem from './CompetitionItem'

export default function CompetitionList({ competitions, className }) {
  return (
    <ul className={classNames(styles.list, className)}>
      {competitions.map((competition) => (
        <CompetitionItem key={competition.id} competition={competition} />
      ))}
    </ul>
  )
}
