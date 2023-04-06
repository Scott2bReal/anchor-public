// src/pages/_app.tsx
import type { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import type { AppType } from 'next/app'
import { Toaster } from 'react-hot-toast'
import { Layout } from '../components/Layout'
import '../styles/globals.css'
import { api } from '../utils/api'

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Toaster position='bottom-right' />
    </SessionProvider>
  )
}

export default api.withTRPC(MyApp)
