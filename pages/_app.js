import '../styles/index.scss'
import Layout from '../components/Layout'
import CompetitionsProvider from '../store/CompetitionsProvider'
import { UserProvider, withPageAuthRequired } from '@auth0/nextjs-auth0'

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <CompetitionsProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </CompetitionsProvider>
    </UserProvider>
  )
}

export default MyApp
