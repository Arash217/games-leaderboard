import styles from './CompetitionForm.module.scss'
import classNames from 'classnames'

export default function CompetitionForm({ onSubmit, name, image, buttonText }) {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <input
        id={'name'}
        placeholder='Competition name'
        defaultValue={name}
        className='input'
        required
      />
      <input
        id={'image'}
        placeholder='Cover image url'
        defaultValue={image}
        className='input'
        required
      />
      <button
        type='submit'
        className={classNames('button button--width-150 button--center')}
      >
        {buttonText}
      </button>
    </form>
  )
}
