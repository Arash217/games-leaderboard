import Navbar from '../Navbar'
import styles from './Layout.module.scss'

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.wrapper}>{children}</div>
      </main>
      <div id="overlays"></div>
    </>
  )
}
