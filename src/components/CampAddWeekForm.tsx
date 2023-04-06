import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { api } from '../utils/api'

interface Props {
  gymId: string
  onRequestClose: () => void
}

export const CampAddWeekForm = ({ gymId, onRequestClose }: Props) => {
  const ctx = api.useContext()
  const addWeek = api.campWeek.addWeek.useMutation({
    onMutate: async () => {
      toast.loading(`Adding camp week to schedule...`)
      await ctx.gym.getCampWeeksById.cancel()
    },
    onSettled: async () => {
      await ctx.gym.getCampWeeksById.invalidate()
    },
    onSuccess: () => {
      onRequestClose()
      toast.dismiss()
      toast.success(`Added camp week to schedule!`)
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(e.message)
    },
  })

  const [weekNumber, setWeekNumber] = useState(1)
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [instructor, setInstructor] = useState('')
  const [slots, setSlots] = useState(20)

  return (
    <form
      className='flex flex-col gap-2 text-center child:rounded-lg child:p-1'
      onSubmit={(e) => {
        e.preventDefault()
        addWeek.mutate({
          gymId: gymId,
          year: new Date().getFullYear(),
          weekNumber: weekNumber,
          startDate: startDate,
          endDate: endDate,
          instructor: instructor,
          slots: slots,
        })
      }}
    >
      <h2 className='text-2xl font-bold'>Add Camp Week to Schedule</h2>
      <label htmlFor='weekNumber'>Week Number</label>
      <input
        type='number'
        min='1'
        max='9'
        id='weekNumber'
        name='weekNumber'
        className='text-neutral-900'
        onChange={(e) => setWeekNumber(Number(e.target.value))}
      />
      <label htmlFor='startDate'>Start Date</label>
      <input
        type='date'
        id='startDate'
        name='startDate'
        className='text-neutral-900'
        onChange={(e) => setStartDate(new Date(e.target.value))}
      />
      <label htmlFor='endDate'>End Date</label>
      <input
        type='date'
        id='endDate'
        name='endDate'
        className='text-neutral-900'
        onChange={(e) => setEndDate(new Date(e.target.value))}
      />
      <label htmlFor='instructor'>Instructor</label>
      <input
        id='instructor'
        name='instuctor'
        className='text-neutral-900'
        onChange={(e) => setInstructor(e.target.value)}
      />
      <label htmlFor='slots'>Slots</label>
      <input
        type='number'
        name='slots'
        id='slots'
        className='text-neutral-900'
        onChange={(e) => setSlots(Number(e.target.value))}
      />
      <button
        className='mt-4 rounded-lg bg-slate-800 p-2 shadow-md shadow-neutral-900 transition duration-150 ease-in-out hover:scale-95'
        type='submit'
      >
        Add Camp Week
      </button>
    </form>
  )
}
