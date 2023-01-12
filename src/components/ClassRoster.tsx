import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { Climber, ClimbingClass, ClimbingSession } from '@prisma/client';
import { useAtom } from 'jotai';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import useLogger from '../hooks/useLogger';
import { climberAtom } from '../utils/atoms/climberAtom';
import { sessionAtom } from '../utils/atoms/sessionAtom';
import grabClimber from '../utils/grabClimber';
import { trpc } from '../utils/trpc';
import EmailsButton from './EmailsButton';

interface SessionReminderProps {
  selectedSession: ClimbingSession | null;
}

const SessionReminder = ({ selectedSession }: SessionReminderProps) => {
  if (!selectedSession) return <h3>Please select a climbing session!</h3>
  return selectedSession.current ? (
    <>
      <h3 className='text-red-600 font-bold'>This class is in the current session ({selectedSession.name}). </h3>
      <h4 className='text-red-600 font-bold'>Please unenroll from the upcoming session instead</h4>
    </>
  ) : (
    <h3>This will unenroll this climber from the <span className='font-bold'>{selectedSession.name}</span> session</h3>
  )
}

interface ClassRosterProps {
  climbingClass: ClimbingClass & { climbers: Climber[] }
}

const ClassRoster = ({ climbingClass }: ClassRosterProps) => {
  const ctx = trpc.useContext()
  const { data: session } = useSession()
  const user = session?.user;
  const logger = useLogger()
  const [, setSelectedClimberId] = useAtom(climberAtom)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [unenrollingClimber, setUnenrollingClimber] = useState<Climber | null>(null)
  const [selectedClimbingSession] = useAtom(sessionAtom)

  if (!session || !user) return <div>Log in!</div>

  const unEnrollClimber = trpc.climber.unEnrollClimber.useMutation({
    onMutate: async () => {
      toast.loading('Unenrolling climber...')
      await ctx.gyms.getById.cancel()
      await ctx.climber.getById.cancel()
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success("Unenrolled climber!")
      setConfirmOpen(false)
      setUnenrollingClimber(null)
    },
    onError: () => {
      toast.dismiss()
      toast.error("Unable to unenroll climber")
    },
    onSettled: () => {
      ctx.gyms.getById.invalidate()
      ctx.climber.getById.invalidate()
    },
  })

  const climbers = climbingClass.climbers

  return (
    <>
      <div className='flex flex-col gap-2 p-4'>
        <h1 className='text-xl flex gap-2 justify-center items-center font-bold'>
          <span>Class Roster</span>
          <EmailsButton climbers={climbingClass.climbers} />
        </h1>
        <ul>
          <div className='flex flex-col justify-start items-start'>
            {climbers.length === 0 ? <li className='text-red-500'>No climbers enrolled</li> : climbers?.map((climber) => {
              return <li key={climber.id}>
                <div className='flex items-center justify-center gap-2'>
                  <button
                    className=''
                    onClick={() => {
                      setUnenrollingClimber(climber)
                      setConfirmOpen(true)
                    }}
                  >
                    <XMarkIcon className='h-4 w-4 text-red-500 hover:scale-75 ease-in-out duration-150 transition' />
                  </button>
                  <span
                    className='hover:cursor-pointer'
                    onClick={() => grabClimber(climber, () => setSelectedClimberId(climber.id))}
                  >{climber.name}</span>

                </div>
              </li>
            })}
          </div>
        </ul>
      </div >

      <Dialog
        open={confirmOpen} onClose={() => setConfirmOpen(false)}
      >
        <div className="z-[3] fixed inset-0 bg-black/50" aria-hidden='true' />
        <div
          className='z-[4] fixed inset-0 items-center flex justify-center p-4 max-h-[100vh]'
        >
          <Dialog.Panel
            className='z-[4] mx-auto rounded-lg bg-neutral-900 p-6 flex flex-col gap-4 justify-center items-center max-h-screen'
          >
            <h1 className='text-2xl font-extrabold '>Unenrolling {unenrollingClimber?.name}</h1>
            <SessionReminder selectedSession={selectedClimbingSession} />

            <form
              onSubmit={(e) => {
                if (!unenrollingClimber) return

                e.preventDefault()
                unEnrollClimber.mutate({
                  classId: climbingClass.id,
                  id: unenrollingClimber.id,
                })
                logger.mutate({
                  climberId: unenrollingClimber.id,
                  message: `${user.name} - Unenrolled from a ${climbingClass.className} class`
                })
              }}
            >
              <div className='flex gap-2 pt-4 justify-center items-center'>
                <button
                  type='submit'
                  className='p-2 bg-green-600 rounded-lg flex-1 shadow-md shadow-black hover:scale-95 transition-transform duration-150 ease-in-out'
                >
                  Confirm
                </button>
                <button
                  className='p-2 bg-red-700 rounded-lg flex-1 shadow-md shadow-black hover:scale-95 transition-transform duration-150 ease-in-out'
                  onClick={() => {
                    setConfirmOpen(false)
                    setUnenrollingClimber(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}

export default ClassRoster
