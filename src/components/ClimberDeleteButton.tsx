import { Dialog } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { Climber } from "@prisma/client";
import { useState } from "react";
import toast from "react-hot-toast";
import { trpc } from "../utils/trpc";

interface ClimberDeleteButtonProps {
  climber: Climber;
}

export const ClimberDeleteButton = ({ climber }: ClimberDeleteButtonProps) => {
  const ctx = trpc.useContext()
  const [isOpen, setIsOpen] = useState(false)
  const [confirm, setConfirm] = useState('')

  const deleteClimber = trpc.climber.deleteClimber.useMutation({
    onMutate: async () => {
      await ctx.climber.getById.cancel()
      await ctx.climber.getAll.cancel()
      toast.loading('Deleting climber...')
    },
    onSettled: () => {
      ctx.climber.getById.invalidate()
      ctx.climber.getAll.invalidate()
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success(`Deleted ${climber.name}`)
      setIsOpen(false)
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(`Error deleting ${climber.name}: ${e.message}`)
    }
  })

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='hover:opacity-75'
      >
        <TrashIcon className='h-4 w-4' />
      </button>

      <Dialog
        open={isOpen} onClose={() => setIsOpen(false)}
      >
        <div className="z-[3] fixed inset-0 bg-black/50" aria-hidden='true' />
        <div
          className='z-[4] fixed inset-0 items-center flex justify-center p-4 max-h-[100vh]'
        >
          <Dialog.Panel
            className='z-[4] mx-auto rounded-lg bg-neutral-900 p-6 flex flex-col gap-4 justify-center items-center max-h-screen'
          >
            <h1 className='text-2xl font-extrabold text-red-700'>Warning! Deleting {climber.name}</h1>
            <h2 className='text-lg'>Please type the climber&apos;s name below to confirm deletion</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                deleteClimber.mutate({
                  confirm: confirm,
                  id: climber.id,
                })
              }}
            >
              <label className='p-2' htmlFor="confirmDelete">Climber Name: </label>
              <input
                id='confirmDelete'
                className='rounded-lg shadow-black shadow-md text-slate-900 px-1'
                onChange={(e) => setConfirm(e.target.value)}
              />
              <div className='flex gap-2 pt-4 justify-center items-center'>
                <button
                  type='submit'
                  className='bg-green-600 rounded-lg flex-1 shadow-md shadow-black hover:scale-95 transition-transform duration-150 ease-in-out'
                >
                  Confirm
                </button>
                <button
                  className='bg-red-700 rounded-lg flex-1 shadow-md shadow-black hover:scale-95 transition-transform duration-150 ease-in-out'
                  onClick={() => setIsOpen(false)}
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
