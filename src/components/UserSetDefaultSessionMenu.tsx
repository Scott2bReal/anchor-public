import { Listbox } from "@headlessui/react";
import { CalendarIcon, CheckIcon, ChevronUpDownIcon, ForwardIcon } from "@heroicons/react/24/outline";
import { ClimbingSession, User } from "@prisma/client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { trpc } from "../utils/trpc";
import LoadingSpinner from "./LoadingSpinner";

interface Props {
  initialDefault: ClimbingSession
  user: User
}

export const UserSetDefaultSessionMenu = ({ initialDefault, user }: Props) => {
  const ctx = trpc.useContext()
  const [selectedSession, setSelectedSession] = useState(initialDefault)
  const [currentDefault, setCurrentDefault] = useState(initialDefault)
  const { data: sessions, isLoading: sessionsLoading } = trpc.climbingSession.getAll.useQuery()
  const showConfirmButton = selectedSession.id !== currentDefault.id

  const setUserDefault = trpc.user.setDefaultSession.useMutation({
    onMutate: async () => {
      toast.loading(`Setting your default session...`)
      await ctx.climbingSession.getAll.cancel()
    },
    onSettled: () => {
      ctx.climbingSession.getAll.invalidate()
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(e.message)
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success(`Changed your default session`)
    }
  })

  if (sessionsLoading) return <LoadingSpinner />
  if (!sessions) return <div>Couldn&apos;t find any sessions!</div>

  console.log(`Show Confirm Button: `, showConfirmButton)

  return (
    <>
      <div className='relative p-2'>
        <Listbox by="id" value={selectedSession} onChange={setSelectedSession}>
          <Listbox.Button className='text-xl font-extrabold bg-gray-800 p-2 rounded-lg shadow-md shadow-neutral-900'>
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
          <Listbox.Options className='absolute top-[64px] z-[8] bg-slate-700 w-full flex flex-col justify-center items-center rounded-lg'>
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
          </Listbox.Options>
          <button
            onClick={() =>{
              if (showConfirmButton) {
                setUserDefault.mutate({userId: user.id, sessionId: selectedSession.id})
                setCurrentDefault(selectedSession)
              }
            }}
          >
           <CheckIcon className={`${showConfirmButton ? 'opacity-100' : 'opacity-0 cursor-default'} h6 w-6 ml-2 transition duration-150 ease-in-out text-green-600`} />
          </button>
        </Listbox>
      </div>
    </>
  )
}
