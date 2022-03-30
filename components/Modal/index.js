import { createPortal } from 'react-dom'
import styles from './Modal.module.scss'
import Image from 'next/image'
import getElementConditionaly from '../../lib/getElementConditionaly'

const Backdrop = ({ onClose }) => {
  return <div className={styles.backdrop} onClick={onClose} />
}

const ModalOverlay = ({ title, children, onClose }) => {
  return (
    <div className={styles.modal}>
      <header className={styles.modalHeader}>
        {title}
        <div className={styles.modalClose}>
          <Image
            onClick={onClose}
            src='/icon-close.svg'
            width='16'
            height='16'
            alt='close'
          />
        </div>
      </header>
      <div className={styles.modalContent}>{children}</div>
    </div>
  )
}

const overlays = getElementConditionaly('#overlays')

const Modal = ({ onClose, children, title }) => {
  return (
    <>
      {createPortal(<Backdrop onClose={onClose} />, overlays)}
      {createPortal(
        <ModalOverlay title={title} onClose={onClose}>
          {children}
        </ModalOverlay>,
        overlays
      )}
    </>
  )
}

export default Modal
