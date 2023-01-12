import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import LoadingSpinner from '../components/LoadingSpinner'

const Home: NextPage = () => {
  const { status } = useSession()
  useRouter().push('/schedule')

  if (status === 'loading') {
    return <main className='flex flex-col items-center pt-4'><LoadingSpinner /></main>
  }

  return (
    <>
      <div className='relative flex-col flex min-h-screen py-10'>
      </div>
    </>
  )
}

export default Home
