// src/pages/_app.tsx
import '../styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import type { Session } from 'next-auth'
import type { AppType } from 'next/app'
import { Layout } from '../components/Layout'
import { trpc } from '../utils/trpc'
import { Toaster } from 'react-hot-toast'

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

export default trpc.withTRPC(MyApp)
