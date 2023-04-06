import { Dialog } from '@headlessui/react'
import type { ClimbingSession } from '@prisma/client'
import { useAtom } from 'jotai'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { api } from '../utils/api'
import { sessionAtom } from '../utils/atoms/sessionAtom'

type DeleteSessionButtonProps = {
  selected: ClimbingSession
  current: ClimbingSession
  onRequestClose: () => void
}

const DeleteSessionButton = ({
  current,
  selected,
  onRequestClose,
}: DeleteSessionButtonProps) => {
  const ctx = api.useContext()
  const [, setSelectedSession] = useAtom(sessionAtom)
  const [isOpen, setIsOpen] = useState(false)
  const toggleIsOpen = () => setIsOpen(!isOpen)
  const deleteSession = api.climbingSession.delete.useMutation({
    onMutate: async () => {
      toast.loading('Deleting session...')
      await ctx.climbingSession.getAll.cancel()
    },
    onSettled: async () => await ctx.climbingSession.getAll.invalidate(),
    onError: (e) => {
      toast.dismiss()
      toast.error(`Couldn't delete session: ${e.message}`)
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success(`Deleted ${selected.name} ${selected.year}`)
      toggleIsOpen()
      onRequestClose()
      setSelectedSession(current)
    },
  })

  return (
    <>
      <button
        className='rounded-lg bg-red-800 p-2 shadow-md shadow-black transition duration-150 ease-in hover:scale-95'
        onClick={() => toggleIsOpen()}
      >
        Delete Selected Session
      </button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <div className='fixed inset-0 z-[4] bg-black/50' aria-hidden='true' />
        <div className='fixed inset-0 z-[5] flex items-center justify-center rounded-lg p-4'>
          <Dialog.Panel className='z-[4] mx-auto rounded-lg bg-neutral-800 p-6 shadow-md shadow-black'>
            <h1>
              Warning! This will delete the{' '}
              {`${selected.name} ${selected.year} session. Do you wish to continue?`}
            </h1>
            <div className='flex justify-evenly gap-2 pt-4'>
              <button
                className='flex-1 rounded-lg bg-green-600 p-2 shadow-md shadow-black transition duration-150 hover:scale-95'
                onClick={() => {
                  if (!selected) {
                    toast.error(
                      'Please select a session which is not the current session'
                    )
                    return
                  } else {
                    deleteSession.mutate({
                      id: selected.id,
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
  )
}

export default DeleteSessionButton
