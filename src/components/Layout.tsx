import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { ReactNode } from 'react'
import GymNav from './GymNav'
import LoadingSpinner from './LoadingSpinner'
import LogInPrompt from './LogInPrompt'
import MobileBar from './MobileBar'
import SideNav from './SideNav'

type LayoutProps = {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <>
        <Head>
          <title>Youth Rec</title>
          <meta name='description' content="Managing FA's youth rec program" />
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <main className='relative flex h-screen flex-col items-center justify-center hover:cursor-progress'>
          <div className='flex items-center justify-center'>
            <LoadingSpinner />
          </div>
        </main>
      </>
    )
  }

  return session ? (
    <>
      <Head>
        <title>Youth Rec</title>
        <meta name='description' content="Managing FA's youth rec program" />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <MobileBar />
      <main className='relative md:flex'>
        {/* <HelpButton /> */}
        <SideNav />
        <div className='flex flex-col justify-start items-center w-full'>
          <GymNav />
          {children}
        </div>
      </main>
    </>
  ) : (
    <>
      <Head>
        <title>Youth Rec</title>
        <meta name='description' content="Managing FA's youth rec program" />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className='relative h-screen items-center justify-center md:flex'>
        <LogInPrompt />
      </main>
    </>
  )
}
