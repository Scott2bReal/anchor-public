import { Dialog } from '@headlessui/react'
import { useAtom } from 'jotai'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import ClassAddButton from '../components/ClassAddButton'
import EmailsButton from '../components/EmailsButton'
import { ExportSession } from '../components/ExportSession'
import LoadingSpinner from '../components/LoadingSpinner'
import NewClassForm from '../components/NewClassForm'
import Schedule from '../components/Schedule'
import { gymAtom } from '../utils/atoms/gymAtom'
import { sessionAtom } from '../utils/atoms/sessionAtom'
import { trpc } from '../utils/trpc'

const GymSchedulePage = () => {
  const [selectedGym] = useAtom(gymAtom)
  const { status } = useSession()
  const [selectedSession] = useAtom(sessionAtom)

  const [isOpen, setIsOpen] = useState(false)
  // const [helpText, setHelpText] = useState(' ')

  // TODO clean this up
  const { isLoading, data: gym } = trpc.gyms.getById.useQuery({ id: selectedGym, sessionId: selectedSession?.id as string })

  const toggleIsOpen = () => setIsOpen(!isOpen)

  if (!selectedSession) return <div>Please select a session using the sidebar</div>
  if (status === 'loading') return <LoadingSpinner />
  if (isLoading) return <LoadingSpinner />
  if (!gym) return <div>Couldn&apos;t find info for that gym</div>

  const climbers = gym.classes.map((climbingClass) => {
    return climbingClass.climbers
  }).flat()

  return (
    <div className='flex flex-col gap-2 justify-center items-center'>
      <div className='flex relative justify-start gap-2 max-w-min items-center'>
        <EmailsButton climbers={climbers} helpText={true} />
        <ClassAddButton toggleFunction={() => toggleIsOpen()} />
      </div>
      <ExportSession />
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="z-[3] fixed inset-0 bg-black/50" aria-hidden='true' />
        <div
          className='z-[4] fixed inset-0 items-center flex justify-center rounded-lg p-4'
        >
          <Dialog.Panel
            className='z-[4] mx-auto rounded-lg bg-neutral-800 p-4'
          >
            <NewClassForm gymId={selectedGym} closeOnRequest={toggleIsOpen} />
          </Dialog.Panel>

        </div>
      </Dialog>
      <Schedule gym={gym} />
    </div>
  )
}

export default GymSchedulePage
