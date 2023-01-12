import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { trpc } from '../utils/trpc'

interface Props {
  gymId: string;
  onRequestClose: () => void;
}

export const CampAddWeekForm = ({ gymId, onRequestClose }: Props) => {
  const ctx = trpc.useContext()
  const addWeek = trpc.campWeek.addWeek.useMutation({
    onMutate: async () => {
      toast.loading(`Adding camp week to schedule...`)
      await ctx.gyms.getCampWeeksById.cancel()
    },
    onSettled: () => {
      ctx.gyms.getCampWeeksById.invalidate()
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
      className='flex flex-col gap-2 child:rounded-lg child:p-1 text-center'
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
      <input type='number' id='weekNumber' name='weekNumber' className='text-neutral-900' onChange={(e) => setWeekNumber(Number(e.target.value))} />
      <label htmlFor='startDate'>Start Date</label>
      <input type='date' id='startDate' name='startDate' className='text-neutral-900' onChange={(e) => setStartDate(new Date(e.target.value))} />
      <label htmlFor='endDate'>End Date</label>
      <input type='date' id='endDate' name='endDate' className='text-neutral-900' onChange={(e) => setEndDate(new Date(e.target.value))} />
      <label htmlFor='instructor'>Instructor</label>
      <input id='instructor' name='instuctor' className='text-neutral-900' onChange={(e) => setInstructor(e.target.value)} />
      <label htmlFor='slots'>Slots</label>
      <input type='number' name='slots' id='slots' className='text-neutral-900' onChange={(e) => setSlots(Number(e.target.value))} />
      <button className='rounded-lg p-2 bg-slate-800 mt-4 shadow-md shadow-neutral-900 hover:scale-95 transition duration-150 ease-in-out' type='submit'>Add Camp Week</button>
    </form>
  )
}
