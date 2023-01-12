import { Dialog } from '@headlessui/react';
import { TrashIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { trpc } from '../utils/trpc';

type DeleteClassButtonProps = {
  classId: string;
  onRequestClose: () => void;
}

export default function DeleteClassButton({ classId, onRequestClose }: DeleteClassButtonProps) {
  const ctx = trpc.useContext()
  const [isOpen, setIsOpen] = useState(false)
  const toggleIsOpen = () => setIsOpen(!isOpen)

  const deleteClass = trpc.climbingClass.deleteClimbingClass.useMutation({
    onMutate: async () => {
      toast.loading('Removing class...')
      await ctx.gyms.getById.cancel()
    },
    onSettled: () => {
      ctx.gyms.getById.invalidate()
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success("Class deleted")
      onRequestClose()
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(e.message)
    }

  })

  return (
    <>
      <button
        onClick={() => toggleIsOpen()}
      >
        <TrashIcon className='h-6 w-6 hover:opacity-75 duration-150 transition ease-in-out' />
      </button>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="z-[4] fixed inset-0 bg-black/50" aria-hidden='true' />
        <div
          className='z-[5] fixed inset-0 items-center flex justify-center rounded-lg p-4'
        >
          <Dialog.Panel
            className='z-[4] mx-auto rounded-lg bg-neutral-800 p-6 flex flex-col justify-center items-center gap-4 shadow-md shadow-neutral-900'
          >
            <h1 className='text-2xl font-bold'>Are you sure you want to delete this class?</h1>
            <h2 className='text-lg'>This cannot be undone, and will erase all enrollments for this session</h2>
            <div className='flex gap-2 pt-4 justify-evenly w-full'>
              <button
                className='p-2 bg-green-600 rounded-lg hover:scale-95 transition duration-150 w-full shadow-md shadow-neutral-900'
                onClick={() => {
                  deleteClass.mutate({
                    id: classId,
                  })
                }}
              >Yes</button>

              <button
                className='p-2 bg-red-600 rounded-lg hover:scale-95 transition duration-150 ease-in-out w-full shadow-neutral-900 shadow-md'
                onClick={() => toggleIsOpen()}
              >No</button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}
