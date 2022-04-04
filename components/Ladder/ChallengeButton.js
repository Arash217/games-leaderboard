import Image from 'next/image'
import { useState, useContext } from 'react'
import styles from './Ladder.module.scss'
import Modal from '../Modal'
import request from '../../lib/request'
import PlayerRanksContext from '../../store/PlayerRanksContext'
import classNames from 'classnames'

export default function ChallengeButton({
  competition,
  challenger,
  challengee,
}) {
  const [challengeModalShown, setChallengeModalShown] = useState(false)
  const playerRanksCtx = useContext(PlayerRanksContext)

  function handleChallengeModalClose() {
    setChallengeModalShown(false)
  }

  async function handleSwapPlayers() {
    try {
      const data = await request(`/api/competitions/${competition.id}/swap`, {
        method: 'POST',
        body: JSON.stringify({
          challengeeId: challengee.playerId,
        }),
      })

      playerRanksCtx.swap(
        data.challengerPlayerRankId,
        data.challengeePlayerRankId
      )
      setChallengeModalShown(false)
    } catch (err) {
      console.log(err.message)
    }
  }

  return (
    <div className={styles.challengeContainer}>
      <button
        className={styles.challenge}
        onClick={() => setChallengeModalShown(true)}
      >
        <Image
          src='/icon-challenge.svg'
          alt='challenge'
          width='40'
          height='40'
        />
      </button>

      {challengeModalShown && (
        <Modal title='Challenge Player' onClose={handleChallengeModalClose}>
          <div className={styles.challengeContent}>
            <div className={styles.challengePlayers}>
              <span className={styles.challenger}>
                {challenger.player.name}
              </span>
              <Image
                src='/icon-challenge.svg'
                alt='challenge'
                width='65'
                height='65'
              />
              <span>{challengee.player.name}</span>
            </div>

            <p>Did the challenger win?</p>

            <div>
              <button
                className={classNames('button', styles.challengeButtonYes)}
                onClick={handleSwapPlayers}
              >
                Yes
              </button>
              <button className='button' onClick={handleChallengeModalClose}>
                No
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
