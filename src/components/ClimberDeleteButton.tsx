import { Dialog } from '@headlessui/react'
import { TrashIcon } from '@heroicons/react/24/solid'
import type { Climber } from '@prisma/client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { api } from '../utils/api'

interface ClimberDeleteButtonProps {
  climber: Climber
}

export const ClimberDeleteButton = ({ climber }: ClimberDeleteButtonProps) => {
  const ctx = api.useContext()
  const [isOpen, setIsOpen] = useState(false)
  const [confirm, setConfirm] = useState('')

  const deleteClimber = api.climber.deleteClimber.useMutation({
    onMutate: async () => {
      await ctx.climber.getById.cancel()
      await ctx.climber.getAll.cancel()
      toast.loading('Deleting climber...')
    },
    onSettled: async () => {
      await ctx.climber.getById.invalidate()
      await ctx.climber.getAll.invalidate()
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success(`Deleted ${climber.name}`)
      setIsOpen(false)
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(`Error deleting ${climber.name}: ${e.message}`)
    },
  })

  return (
    <>
      <button onClick={() => setIsOpen(true)} className='hover:opacity-75'>
        <TrashIcon className='h-4 w-4' />
      </button>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <div className='fixed inset-0 z-[3] bg-black/50' aria-hidden='true' />
        <div className='fixed inset-0 z-[4] flex max-h-[100vh] items-center justify-center p-4'>
          <Dialog.Panel className='z-[4] mx-auto flex max-h-screen flex-col items-center justify-center gap-4 rounded-lg bg-neutral-900 p-6'>
            <h1 className='text-2xl font-extrabold text-red-700'>
              Warning! Deleting {climber.name}
            </h1>
            <h2 className='text-lg'>
              Please type the climber&apos;s name below to confirm deletion
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                deleteClimber.mutate({
                  confirm: confirm,
                  id: climber.id,
                })
              }}
            >
              <label className='p-2' htmlFor='confirmDelete'>
                Climber Name:{' '}
              </label>
              <input
                id='confirmDelete'
                className='rounded-lg px-1 text-slate-900 shadow-md shadow-black'
                onChange={(e) => setConfirm(e.target.value)}
              />
              <div className='flex items-center justify-center gap-2 pt-4'>
                <button
                  type='submit'
                  className='flex-1 rounded-lg bg-green-600 shadow-md shadow-black transition-transform duration-150 ease-in-out hover:scale-95'
                >
                  Confirm
                </button>
                <button
                  className='flex-1 rounded-lg bg-red-700 shadow-md shadow-black transition-transform duration-150 ease-in-out hover:scale-95'
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
