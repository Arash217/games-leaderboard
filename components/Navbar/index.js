import Link from 'next/link'
import Image from 'next/image'
import styles from './Navbar.module.scss'
import { useUser } from '@auth0/nextjs-auth0'

export default function Navbar() {
  const { user } = useUser()

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

        {user && (
          <div className={styles.authentication}>
            <p className={styles.name}>{user.name}</p>
            <Link href='/api/auth/logout'>
              <a className='button'>Logout</a>
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
