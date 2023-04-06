import { Dialog } from '@headlessui/react'
import type { ClimbingSession } from '@prisma/client'
import { useAtom } from 'jotai'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { api } from '../utils/api'
import { sessionAtom } from '../utils/atoms/sessionAtom'
import DeleteSessionButton from './DeleteSessionButton'
import SetCurrentSessionButton from './SetCurrentSessionButton'
import { SetUpcomingSessionButton } from './SetUpcomingSessionButton'

type SessionControlsProps = {
  current: ClimbingSession
  onRequestClose: () => void
}

const SessionControls = ({ current, onRequestClose }: SessionControlsProps) => {
  const ctx = api.useContext()
  const [isOpen, setIsOpen] = useState(false)
  const toggleIsOpen = () => setIsOpen(!isOpen)

  const copySchedule = api.climbingSession.copyClasses.useMutation({
    onMutate: async () => {
      toast.loading('Copying schedule to new session...')
      await ctx.gym.getById.cancel()
    },
    onSettled: async () => await ctx.gym.getById.invalidate(),
    onError: (e) => {
      toast.dismiss()
      toast.error(`Couldn't copy over schedule: ${e.message}`)
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success(
        'Copied schedule and enrollments to the new session! You may need to refresh the page to see results',
        {
          duration: 5000,
        }
      )
      onRequestClose()
    },
    trpc: {
      context: {
        skipBatch: true,
      },
    },
  })

  const [selectedSession] = useAtom(sessionAtom)
  if (!selectedSession) {
  }

  return selectedSession ? (
    <>
      <div className='flex flex-col items-center justify-center gap-2'>
        <h1 className='text-2xl font-extrabold'>Session Controls</h1>
        <h2 className='text-xl font-bold'>{`Selected Session: ${selectedSession?.name} ${selectedSession?.year}`}</h2>
        <h2 className='text-xl font-bold'>{`Current Session: ${current.name} ${current.year}`}</h2>
        <div className='flex flex-col gap-2  '>
          <button
            className='rounded-lg bg-slate-700 p-2 shadow-md shadow-black transition duration-150 ease-in hover:scale-95'
            onClick={() => {
              if (current.id === selectedSession?.id) {
                toast.error('Selected session is the current session')
                return
              } else if (!selectedSession) {
                toast.error(
                  'Please select a session which is not the current session'
                )
                return
              } else {
                toggleIsOpen()
              }
            }}
          >
            Copy Schedule
          </button>
          {!selectedSession.current ? (
            <SetCurrentSessionButton
              selected={selectedSession}
              onRequestClose={onRequestClose}
            />
          ) : (
            <></>
          )}
          {!selectedSession.upcoming && !selectedSession.current ? (
            <SetUpcomingSessionButton
              selected={selectedSession}
              onRequestClose={onRequestClose}
            />
          ) : (
            <></>
          )}
          <DeleteSessionButton
            current={current}
            selected={selectedSession}
            onRequestClose={onRequestClose}
          />
        </div>
      </div>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <div className='fixed inset-0 z-[4] bg-black/50' aria-hidden='true' />
        <div className='fixed inset-0 z-[5] flex items-center justify-center rounded-lg p-4'>
          <Dialog.Panel className='z-[4] mx-auto rounded-lg bg-neutral-800 p-6 shadow-md shadow-black'>
            <div className='flex flex-col items-center justify-center gap-2'>
              <h1 className='text-2xl'>
                This will copy all current classes from
              </h1>
              <h2 className='text-xl font-extrabold'>{`${current.name} ${current.year} >>> ${selectedSession.name} ${selectedSession.year}.`}</h2>
              <h3 className='text-lg'>Do you want to continue?</h3>
            </div>
            <div className='flex justify-evenly gap-2 pt-4'>
              <button
                className='flex-1 rounded-lg bg-green-600 p-2 shadow-md shadow-black transition duration-150 hover:scale-95'
                onClick={() => {
                  if (!selectedSession) {
                    toast.error(
                      'Please select a session which is not the current session'
                    )
                    return
                  } else {
                    copySchedule.mutate({
                      currentSessionId: current.id,
                      newSessionId: selectedSession.id,
                    })
                  }
                }}
              >
                Yes
              </button>

              <button
                className='flex-1 rounded-lg bg-red-600 p-2 shadow-md shadow-black transition duration-150 ease-in-out hover:scale-95'
                onClick={() => toggleIsOpen()}
              >
                No
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  ) : (
    <>
      {toast.error('Please select a session')}
      {onRequestClose()}
    </>
  )
}

export default SessionControls
