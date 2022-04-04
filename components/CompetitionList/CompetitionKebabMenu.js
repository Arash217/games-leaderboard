import styles from './CompetitionList.module.scss'
import Image from 'next/image'
import Tippy from '@tippyjs/react'
import 'tippy.js/dist/tippy.css'
import { useState, useMemo, useContext, useCallback, useRef } from 'react'
import CompetitionsContext from '../../store/CompetitionsContext'
import Modal from '../Modal'
import CompetitionForm from '../CompetitionForm'
import getElementConditionaly from '../../lib/getElementConditionaly'
import useClickOutside from '../../lib/hooks/useClickOutside'
import request from '../../lib/request'

export default function CompetitionKebabMenu({ competition }) {
  const [deleteModalShown, setDeleteModalShown] = useState(false)
  const [editModalShown, setEditModalShown] = useState(false)
  const [kebabMenuShown, setKebabMenuShown] = useState(false)
  const kebabMenuRef = useRef(null)
  const competitionsCtx = useContext(CompetitionsContext)

  useClickOutside(kebabMenuRef, () => {
    setKebabMenuShown(false)
  })

  const handleUpdate = async (e) => {
    e.preventDefault()
    const { name, image } = e.target

    try {
      const data = await request(`/api/competitions/${competition.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: name.value,
          image: image.value,
        }),
      })

      competitionsCtx.update(data)
      handleEditModalClose()
    } catch (err) {
      console.log(err)
    }
  }

  const handleRemove = useCallback(async () => {
    try {
      const data = await request(`/api/competitions/${competition.id}`, {
        method: 'DELETE',
      })

      competitionsCtx.remove(data.id)
      handleDeleteModalClose()
    } catch (err) {
      console.log(err)
    }
  }, [competition.id, competitionsCtx])

  function handleDeleteModalClose() {
    setDeleteModalShown(false)
  }

  function handleEditModalClose() {
    setEditModalShown(false)
  }

  function handleDeleteModalOpen() {
    setDeleteModalShown(true)
    setKebabMenuShown(false)
  }

  function handleEditModalOpen() {
    setEditModalShown(true)
    setKebabMenuShown(false)
  }

  const overlays = getElementConditionaly('#overlays')

  const content = useMemo(
    () => (
      <div className={styles.menu}>
        <button className={'button--clean'} onClick={handleEditModalOpen}>
          Edit
        </button>
        <button className={'button--clean'} onClick={handleDeleteModalOpen}>
          Delete
        </button>
      </div>
    ),
    []
  )

  return (
    <>
      <div className={styles.menuContainer}>
        <span className={styles.title}>{competition.name}</span>
        <Tippy
          theme='custom'
          placement='right'
          animation='false'
          duration='0'
          interactive={true}
          appendTo={overlays}
          content={content}
          visible={kebabMenuShown}
        >
          <button
            className={styles.kebab}
            onClick={() => setKebabMenuShown(true)}
            ref={kebabMenuRef}
          >
            <Image src={'/kebab.svg'} alt='kebab menu' width='24' height='24' />
          </button>
        </Tippy>
      </div>

      {editModalShown && (
        <Modal title='Edit competition' onClose={handleEditModalClose}>
          <CompetitionForm
            name={competition.name}
            image={competition.image}
            buttonText='Save'
            onSubmit={handleUpdate}
          />
        </Modal>
      )}

      {deleteModalShown && (
        <Modal title='Delete competition' onClose={handleDeleteModalClose}>
          <p>Delete competition?</p>
          <button
            className={'button button--width-150 button--center'}
            onClick={handleRemove}
          >
            Ok
          </button>
        </Modal>
      )}
    </>
  )
}
