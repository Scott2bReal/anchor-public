import { Dialog } from '@headlessui/react'
import { WrenchScrewdriverIcon } from '@heroicons/react/24/outline'
import type { User } from '@prisma/client'
import { useState } from 'react'
import { api } from '../utils/api'
import LoadingSpinner from './LoadingSpinner'
import { UserControls } from './UserControls'

interface Props {
  user: User
}

export const UserControlsButton = ({ user }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleIsOpen = () => setIsOpen(!isOpen)
  const { data: userDefaultSession, isLoading: defaultLoading } =
    api.climbingSession.getById.useQuery({ id: user?.defaultSessionId ?? '' })

  if (defaultLoading) return <LoadingSpinner />
  if (!user || !userDefaultSession) return <div>You must be logged in</div>

  return (
    <>
      <button
        onClick={() => toggleIsOpen()}
        className='inline rounded-md border-gray-800 bg-slate-700 p-2 text-center shadow-md shadow-neutral-900 transition ease-out hover:scale-95'
      >
        <WrenchScrewdriverIcon className='h-6 w-6' />
      </button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <div className='fixed inset-0 z-[3] bg-black/50' aria-hidden='true' />
        <div className='fixed inset-0 z-[4] flex max-h-[100vh] items-center justify-center p-4'>
          <Dialog.Panel className='z-[4] mx-auto max-h-screen rounded-lg bg-neutral-800 p-6 text-center'>
            <UserControls user={user} onRequestClose={() => setIsOpen(false)} />
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}
