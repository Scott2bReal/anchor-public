import { Dialog, Listbox } from '@headlessui/react'
import { ForwardIcon } from '@heroicons/react/24/outline'
import {
  CalendarIcon,
  CheckIcon,
  ChevronUpDownIcon,
  InformationCircleIcon,
  PlusCircleIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/solid'
import type { User } from '@prisma/client'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { api } from '../utils/api'
import { sessionAtom } from '../utils/atoms/sessionAtom'
import LoadingSpinner from './LoadingSpinner'
import NewSessionForm from './NewSessionForm'
import SessionControls from './SessionControls'
import SessionInfo from './SessionInfo'
import { UserAutoDefaultSessionButton } from './UserAutoDefaultSessionButton'

interface Props {
  user: User
}

const SessionSelector = ({ user }: Props) => {
  const { isLoading: sessionsLoading, data: sessions } =
    api.climbingSession.getAll.useQuery()
  const [createNewOpen, setCreateNewOpen] = useState(false)
  const [controlsOpen, setControlsOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)

  const toggleIsOpen = () => setCreateNewOpen(!createNewOpen)
  const toggleControlsOpen = () => setControlsOpen(!controlsOpen)

  const useDefaultSession = () => {
    const { isLoading: defaultLoading, data: userDefault } =
      api.climbingSession.getById.useQuery({ id: user.defaultSessionId })

    const [selectedSession, setSelectedSession] = useAtom(sessionAtom)

    useEffect(() => {
      if (userDefault && !selectedSession) {
        setSelectedSession(userDefault)
      }
    }, [userDefault, selectedSession, setSelectedSession])

    return { defaultLoading, userDefault, selectedSession, setSelectedSession }
  }

  const { defaultLoading, userDefault, selectedSession, setSelectedSession } =
    useDefaultSession()

  if (sessionsLoading || defaultLoading) return <LoadingSpinner />
  if (!sessions || !sessions[0])
    return <h1>There are no climbing sessions...</h1>
  const current = sessions.find((session) => session.current)
  if (!current) return <h1>There is no current session</h1>

  if (!userDefault)
    return (
      <>
        <h1>Please set a default session</h1>
        <UserAutoDefaultSessionButton user={user} currentId={current.id} />
      </>
    )

  return (
    <>
      <div className='relative flex flex-col items-center justify-center gap-2'>
        <Listbox by='id' value={selectedSession} onChange={setSelectedSession}>
          <Listbox.Button className='text-xl font-extrabold'>
            <div className='flex items-center justify-center gap-2'>
              {`${selectedSession?.name ?? 'Select a session'} ${
                selectedSession?.year ?? ''
              }`}
              <CalendarIcon
                className={`${
                  selectedSession?.current ? 'block' : 'hidden'
                } h-4 w-4`}
              />
              <div
                className={`${selectedSession?.upcoming ? 'block' : 'hidden'}`}
              >
                <CalendarIcon className='h-4 w-4' />
                <ForwardIcon className='h-4 w-4' />
              </div>
              <ChevronUpDownIcon className='h-6 w-6' />
            </div>
          </Listbox.Button>
          <Listbox.Options className='absolute top-[32px] z-[8] flex w-full flex-col items-center justify-center rounded-lg bg-slate-700'>
            {sessions.map((session) => {
              return (
                <Listbox.Option
                  key={session.id}
                  value={session}
                  className='flex w-full items-center justify-start gap-2 rounded-lg p-2 hover:cursor-pointer hover:bg-gray-500'
                >
                  {`${session.name} ${session.year}`}
                  <CalendarIcon
                    className={`${
                      session.current ? 'block' : 'hidden'
                    } h-4 w-4`}
                  />
                  <div className={`${session.upcoming ? 'block' : 'hidden'}`}>
                    <CalendarIcon className='h-4 w-4' />
                    <ForwardIcon className='h-4 w-4' />
                  </div>
                  <CheckIcon className='hidden h-4 w-4 ui-selected:block' />
                </Listbox.Option>
              )
            })}
            <button
              className='flex w-full items-center justify-center gap-2 rounded-lg p-2 hover:cursor-pointer hover:bg-gray-500'
              onClick={() => setCreateNewOpen(true)}
            >
              <span>Add New Session</span>
              <PlusCircleIcon className='h-4 w-4' />
            </button>
            {current.id === selectedSession?.id ? (
              <></>
            ) : (
              <button
                className='flex w-full items-center justify-center gap-2 rounded-lg p-2 hover:cursor-pointer hover:bg-gray-500'
                onClick={() => setControlsOpen(true)}
              >
                <span>Session Controls</span>
                <WrenchScrewdriverIcon className='h-4 w-4' />
              </button>
            )}
            {selectedSession ? (
              <button
                className='flex w-full items-center justify-center gap-2 rounded-lg p-2 hover:cursor-pointer hover:bg-gray-500'
                onClick={() => setInfoOpen(true)}
              >
                <div className='flex items-center justify-center gap-2'>
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
        <div className='fixed inset-0 z-[4] flex flex-col items-center justify-center p-4'>
          <Dialog.Panel className='z-[4] mx-auto flex flex-col items-center justify-center gap-4 rounded-lg bg-neutral-900 p-6 drop-shadow-lg'>
            <NewSessionForm onRequestClose={toggleIsOpen} />
            <button
              className='rounded-lg bg-slate-800 p-2 shadow-md shadow-black transition duration-150 ease-in-out hover:scale-95'
              onClick={() => setCreateNewOpen(false)}
            >
              Close this window
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
      <Dialog open={controlsOpen} onClose={() => setControlsOpen(false)}>
        <div className='fixed inset-0 z-[3] bg-black/50' aria-hidden='true' />
        <div className='fixed inset-0 z-[4] flex flex-col items-center justify-center p-4'>
          <Dialog.Panel className='z-[4] mx-auto flex flex-col items-center justify-center gap-4 rounded-lg bg-neutral-900 p-6 drop-shadow-lg'>
            <SessionControls
              current={current}
              onRequestClose={toggleControlsOpen}
            />
            <button
              className='rounded-lg bg-slate-800 p-2 shadow-md shadow-black transition duration-150 ease-in-out hover:scale-95'
              onClick={() => setControlsOpen(false)}
            >
              Close this window
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
      <Dialog open={infoOpen} onClose={() => setInfoOpen(false)}>
        <div className='fixed inset-0 z-[3] bg-black/50' aria-hidden='true' />
        <div className='fixed inset-0 z-[4] flex flex-col items-center justify-center p-4'>
          <Dialog.Panel className='z-[4] mx-auto flex flex-col items-center justify-center gap-4 rounded-lg bg-neutral-900 p-6 drop-shadow-lg'>
            <SessionInfo session={selectedSession} />
            <button
              className='rounded-lg bg-slate-800 p-2 shadow-md shadow-black transition duration-150 ease-in-out hover:scale-95'
              onClick={() => setInfoOpen(false)}
            >
              Close this window
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}

export default SessionSelector
