import { Dialog } from '@headlessui/react'
import { useAtom } from 'jotai'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import ClassAddButton from '../components/ClassAddButton'
import EmailsButton from '../components/EmailsButton'
import LoadingSpinner from '../components/LoadingSpinner'
import NewClassForm from '../components/NewClassForm'
import Schedule from '../components/Schedule'
import { useRedirectForCampPref } from '../hooks/useRedirectForCampPref'
import { api } from '../utils/api'
import { gymAtom } from '../utils/atoms/gymAtom'
import { sessionAtom } from '../utils/atoms/sessionAtom'

const GymSchedulePage = () => {
  const [selectedGym] = useAtom(gymAtom)
  const { data: session, status } = useSession()
  const [selectedSession] = useAtom(sessionAtom)

  const [isOpen, setIsOpen] = useState(false)
  // const [helpText, setHelpText] = useState(' ')

  // TODO clean this up
  const { isLoading, data: gym } = api.gym.getById.useQuery({
    id: selectedGym,
    sessionId: selectedSession?.id as string,
  })

  const toggleIsOpen = () => setIsOpen(!isOpen)

  useRedirectForCampPref()

  if (status === 'loading') return <LoadingSpinner />
  if (!session) return <div>Please log in</div>
  if (!selectedSession)
    return <div>Please select a session using the sidebar</div>
  if (isLoading) return <LoadingSpinner />
  if (!gym) return <div>Couldn&apos;t find info for that gym</div>

  const climbers = gym.classes
    .map((climbingClass) => {
      return climbingClass.climbers
    })
    .flat()

  return (
    <div className='flex flex-col items-center justify-center gap-2'>
      <div className='relative flex max-w-min items-center justify-start gap-2'>
        <EmailsButton climbers={climbers} helpText={true} />
        <ClassAddButton toggleFunction={() => toggleIsOpen()} />
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <div className='fixed inset-0 z-[3] bg-black/50' aria-hidden='true' />
        <div className='fixed inset-0 z-[4] flex items-center justify-center rounded-lg p-4'>
          <Dialog.Panel className='z-[4] mx-auto rounded-lg bg-neutral-800 p-4'>
            <NewClassForm gymId={selectedGym} onRequestClose={toggleIsOpen} />
          </Dialog.Panel>
        </div>
      </Dialog>
      <Schedule gym={gym} />
    </div>
  )
}

export default GymSchedulePage
