import '../styles/index.scss'
import Layout from '../components/Layout'
import CompetitionsProvider from '../store/CompetitionsProvider'

function MyApp({ Component, pageProps }) {
  return (
    <CompetitionsProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </CompetitionsProvider>
  )
}

export default MyApp
