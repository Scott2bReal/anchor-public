import { Dialog } from '@headlessui/react'
import { TrashIcon } from '@heroicons/react/24/solid'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { api } from '../utils/api'

type DeleteClassButtonProps = {
  classId: string
  onRequestClose: () => void
}

export default function DeleteClassButton({
  classId,
  onRequestClose,
}: DeleteClassButtonProps) {
  const ctx = api.useContext()
  const [isOpen, setIsOpen] = useState(false)
  const toggleIsOpen = () => setIsOpen(!isOpen)

  const deleteClass = api.climbingClass.deleteClimbingClass.useMutation({
    onMutate: async () => {
      toast.loading('Removing class...')
      await ctx.gym.getById.cancel()
    },
    onSettled: async () => {
      await ctx.gym.getById.invalidate()
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success('Class deleted')
      onRequestClose()
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(e.message)
    },
  })

  return (
    <>
      <button onClick={() => toggleIsOpen()}>
        <TrashIcon className='h-6 w-6 transition duration-150 ease-in-out hover:opacity-75' />
      </button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <div className='fixed inset-0 z-[4] bg-black/50' aria-hidden='true' />
        <div className='fixed inset-0 z-[5] flex items-center justify-center rounded-lg p-4'>
          <Dialog.Panel className='z-[4] mx-auto flex flex-col items-center justify-center gap-4 rounded-lg bg-neutral-800 p-6 shadow-md shadow-neutral-900'>
            <h1 className='text-2xl font-bold'>
              Are you sure you want to delete this class?
            </h1>
            <h2 className='text-lg'>
              This cannot be undone, and will erase all enrollments for this
              session
            </h2>
            <div className='flex w-full justify-evenly gap-2 pt-4'>
              <button
                className='w-full rounded-lg bg-green-600 p-2 shadow-md shadow-neutral-900 transition duration-150 hover:scale-95'
                onClick={() => {
                  deleteClass.mutate({
                    id: classId,
                  })
                }}
              >
                Yes
              </button>

              <button
                className='w-full rounded-lg bg-red-600 p-2 shadow-md shadow-neutral-900 transition duration-150 ease-in-out hover:scale-95'
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
