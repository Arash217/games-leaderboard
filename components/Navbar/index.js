import Link from 'next/link'
import Image from 'next/image'
import styles from './Navbar.module.scss'

export default function Navbar() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href='/'>
          <a>
            <Image src='/logo.svg' alt='logo' width='190' height='32' />
          </a>
        </Link>
        <ul className={styles.navList}>
          <li>
            <Link href='/'>
              <a>Competitions</a>
            </Link>
          </li>
          <li>
            <Link href='/players'>
              <a>Players</a>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
