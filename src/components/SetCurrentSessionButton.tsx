import { Dialog } from '@headlessui/react'
import type { ClimbingSession } from '@prisma/client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { api } from '../utils/api'

type SetCurrentSessionButtonProps = {
  selected: ClimbingSession
  onRequestClose: () => void
}

const SetCurrentSessionButton = ({
  selected,
  onRequestClose,
}: SetCurrentSessionButtonProps) => {
  const ctx = api.useContext()
  const [isOpen, setIsOpen] = useState(false)
  const toggleIsOpen = () => setIsOpen(!isOpen)

  const setCurrent = api.climbingSession.setCurrent.useMutation({
    onMutate: async () => {
      toast.loading('Setting as current session...')
      await ctx.climbingSession.getAll.cancel()
      await ctx.climbingSession.getCurrent.cancel()
    },
    onSettled: async () => {
      await ctx.climbingSession.getAll.invalidate()
      await ctx.climbingSession.getCurrent.invalidate()
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(`Couldn't set session as current: ${e.message}`)
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success(
        `${selected.name} ${selected.year} is now the current session`
      )
      toggleIsOpen()
      onRequestClose()
    },
  })

  return (
    <>
      <button
        className='rounded-lg bg-green-800 p-2 shadow-md shadow-black transition duration-150 ease-in hover:scale-95'
        onClick={() => toggleIsOpen()}
      >
        Set As Current
      </button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <div className='fixed inset-0 z-[4] bg-black/50' aria-hidden='true' />
        <div className='fixed inset-0 z-[5] flex items-center justify-center rounded-lg p-4'>
          <Dialog.Panel className='z-[4] mx-auto rounded-lg bg-neutral-800 p-6 shadow-md shadow-black'>
            <h1>{`This will set ${selected.name} ${selected.year} session as the current session. Do you wish to continue?`}</h1>
            <div className='flex justify-evenly gap-2 pt-4'>
              <button
                className='flex-1 rounded-lg bg-green-600 p-2 shadow-md shadow-black transition duration-150 hover:scale-95'
                onClick={() => {
                  if (!selected) {
                    toast.error('This is not a valid session...')
                    return
                  } else {
                    setCurrent.mutate({
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

export default SetCurrentSessionButton
