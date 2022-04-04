import styles from './SearchBar.module.scss'

export default function SearchBar({ onSearch, placeholder }) {
  return (
    <div className={styles.searchContainer}>
      <input
        onChange={onSearch}
        className={'input'}
        placeholder={placeholder}
      />
    </div>
  )
}
