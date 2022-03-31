import '../styles/index.scss'
import Layout from '../components/Layout'
import CompetitionsProvider from '../store/CompetitionsProvider'
import PlayerRanksProvider from '../store/PlayerRanksProvider'
import { UserProvider } from '@auth0/nextjs-auth0'

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <CompetitionsProvider>
        <PlayerRanksProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </PlayerRanksProvider>
      </CompetitionsProvider>
    </UserProvider>
  )
}

export default MyApp
