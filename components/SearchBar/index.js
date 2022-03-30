import styles from './SearchBar.module.scss'

export default function SearchBar({ onSearch }) {
  return (
    <div className={styles.searchContainer}>
      <input
        onChange={onSearch}
        className={'input'}
        placeholder='Filter competitions...'
      />
    </div>
  )
}
