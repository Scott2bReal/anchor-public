import { Bars3Icon } from '@heroicons/react/24/solid'
import { useSession } from 'next-auth/react'
import { toggleSidebar } from '../utils/toggleSidebar'
import LogInPrompt from './LogInPrompt'

export const mobileBarHeight = '64px'

const MobileBar = () => {
  const { data: session } = useSession()

  return session ? (
    <div
      className={`sticky top-0 h-[${mobileBarHeight}] z-[1] bg-gray-800 text-gray-100 md:hidden`}
    >
      <button onClick={() => toggleSidebar()} className='p-4'>
        <Bars3Icon className='h-8 w-8'></Bars3Icon>
      </button>
    </div>
  ) : (
    <LogInPrompt />
  )
}

export default MobileBar
