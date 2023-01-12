import { Dialog, Listbox } from '@headlessui/react'
import {
  CalendarIcon,
  CheckIcon,
  ChevronUpDownIcon,
  InformationCircleIcon,
  PlusCircleIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/solid'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { sessionAtom } from '../utils/atoms/sessionAtom'
import { trpc } from '../utils/trpc'
import NewSessionForm from './NewSessionForm'
import SessionControls from './SessionControls'
import SessionInfo from './SessionInfo'
import { User } from '@prisma/client'
import { ForwardIcon } from '@heroicons/react/24/outline'

interface Props {
  user: User
}

const SessionSelector = ({ user }: Props) => {
  const { isLoading: sessionsLoading, data: sessions } = trpc.climbingSession.getAll.useQuery()
  const [createNewOpen, setCreateNewOpen] = useState(false)
  const [controlsOpen, setControlsOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)

  const toggleIsOpen = () => setCreateNewOpen(!createNewOpen);
  const toggleControlsOpen = () => setControlsOpen(!controlsOpen);

  const useDefaultSession = () => {
    const { isLoading: defaultLoading, data: userDefault } =
      trpc.climbingSession.getById.useQuery({ id: user.defaultSessionId })

    const [selectedSession, setSelectedSession] = useAtom(sessionAtom)

    useEffect(
      () => {
        if (userDefault && !selectedSession) {
          setSelectedSession(userDefault)
        }
      },
      [userDefault, selectedSession, setSelectedSession]
    )

    return { defaultLoading, userDefault, selectedSession, setSelectedSession }
  }

  const { defaultLoading, userDefault, selectedSession, setSelectedSession } = useDefaultSession()


  if (sessionsLoading || defaultLoading)
    return <div>Loading session data...</div>
  if (!sessions || !userDefault)
    return <div>There are no climbing sessions in the system!</div>

  const current = sessions.filter(session => session.current)[0] ?? userDefault

  return (
    <>
      <div className='flex flex-col gap-2 relative justify-center items-center'>
        <Listbox by="id" value={selectedSession} onChange={setSelectedSession}>
          <Listbox.Button className='text-xl font-extrabold'>
            <div className='flex items-center justify-center gap-2'>
              {`${selectedSession?.name ?? 'Select a session'} ${selectedSession?.year ?? ''}`}
              <CalendarIcon className={`${selectedSession?.current ? 'block' : 'hidden'} h-4 w-4`} />
              <div className={`${selectedSession?.upcoming ? 'block' : 'hidden'}`}>
                <CalendarIcon className='h-4 w-4' />
                <ForwardIcon className='h-4 w-4' />
              </div>
              <ChevronUpDownIcon className='h-6 w-6' />
            </div>
          </Listbox.Button>
          <Listbox.Options className='absolute top-[32px] z-[8] bg-slate-700 w-full flex flex-col justify-center items-center rounded-lg'>
            {sessions.map((session) => {
              return (
                <Listbox.Option
                  key={session.id}
                  value={session}
                  className='hover:bg-gray-500 hover:cursor-pointer w-full rounded-lg p-2 flex gap-2 items-center justify-start'
                >
                  {`${session.name} ${session.year}`}
                  <CalendarIcon className={`${session.current ? 'block' : 'hidden'} h-4 w-4`} />
                  <div className={`${session.upcoming ? 'block' : 'hidden'}`}>
                    <CalendarIcon className='h-4 w-4' />
                    <ForwardIcon className='h-4 w-4' />
                  </div>
                  <CheckIcon className='hidden ui-selected:block h-4 w-4' />
                </Listbox.Option>
              )
            })}
            <button
              className='p-2 flex gap-2 items-center justify-center hover:cursor-pointer hover:bg-gray-500 w-full rounded-lg'
              onClick={() => setCreateNewOpen(true)}
            >
              <span>Add New Session</span>
              <PlusCircleIcon className='w-4 h-4' />
            </button>
            {current.id === selectedSession?.id ? (
              <></>
            ) : (
              <button
                className='p-2 flex gap-2 items-center justify-center hover:cursor-pointer hover:bg-gray-500 w-full rounded-lg'
                onClick={() => setControlsOpen(true)}
              >
                <span>Session Controls</span>
                <WrenchScrewdriverIcon className='w-4 h-4' />
              </button>
            )
            }
            {selectedSession ? (
              <button
                className='p-2 flex gap-2 items-center justify-center hover:cursor-pointer hover:bg-gray-500 w-full rounded-lg'
                onClick={() => setInfoOpen(true)}
              >
                <div className='flex gap-2 justify-center items-center'>
                  <span>Session Info</span>
                  <InformationCircleIcon className='h-4 w-4' />
                </div>
              </button>
            ) : (
              <></>
            )}
          </Listbox.Options>
        </Listbox>
      </div>
      <Dialog open={createNewOpen} onClose={() => setCreateNewOpen(false)}>
        <div className='fixed inset-0 z-[3] bg-black/50' aria-hidden='true' />
        <div className='fixed flex flex-col inset-0 z-[4] items-center justify-center p-4'>
          <Dialog.Panel className='z-[4] mx-auto rounded-lg bg-neutral-900 p-6 drop-shadow-lg flex flex-col items-center justify-center gap-4'>
            <NewSessionForm onRequestClose={toggleIsOpen} />
            <button className='p-2 bg-slate-800 rounded-lg hover:scale-95 transition duration-150 ease-in-out shadow-md shadow-black' onClick={() => setCreateNewOpen(false)}>
              Close this window
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
      <Dialog open={controlsOpen} onClose={() => setControlsOpen(false)}>
        <div className='fixed inset-0 z-[3] bg-black/50' aria-hidden='true' />
        <div className='fixed flex flex-col inset-0 z-[4] items-center justify-center p-4'>
          <Dialog.Panel className='z-[4] mx-auto rounded-lg bg-neutral-900 p-6 drop-shadow-lg flex flex-col items-center justify-center gap-4'>
            <SessionControls current={current} onRequestClose={toggleControlsOpen} />
            <button className='p-2 bg-slate-800 rounded-lg hover:scale-95 transition duration-150 ease-in-out shadow-md shadow-black' onClick={() => setControlsOpen(false)}>
              Close this window
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
      <Dialog open={infoOpen} onClose={() => setInfoOpen(false)}>
        <div className='fixed inset-0 z-[3] bg-black/50' aria-hidden='true' />
        <div className='fixed flex flex-col inset-0 z-[4] items-center justify-center p-4'>
          <Dialog.Panel className='z-[4] mx-auto rounded-lg bg-neutral-900 p-6 drop-shadow-lg flex flex-col items-center justify-center gap-4'>
            <SessionInfo session={selectedSession} />
            <button className='p-2 bg-slate-800 rounded-lg hover:scale-95 transition duration-150 ease-in-out shadow-md shadow-black' onClick={() => setInfoOpen(false)}>
              Close this window
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}

export default SessionSelector
