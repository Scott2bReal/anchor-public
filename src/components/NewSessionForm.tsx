import { useState } from "react"
import toast from "react-hot-toast"
import { trpc } from "../utils/trpc"

type NewSessionFormProps = {
  onRequestClose: () => void;
}

const NewSessionForm = ({ onRequestClose }: NewSessionFormProps) => {
  const ctx = trpc.useContext()

  // Form states
  const [year, setYear] = useState(2022)
  const [sessionName, setSessionName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const createSession = trpc.climbingSession.create.useMutation({
    onMutate: async () => {
      toast.loading('Creating session...')
      await ctx.climbingSession.getAll.cancel()
      await ctx.gyms.getById.cancel()
    },
    onSettled: () => {
      ctx.climbingSession.getAll.invalidate()
      ctx.gyms.getById.invalidate()
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success("New session created!")
      onRequestClose();
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(e.message)
    }
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        createSession.mutate({
          name: sessionName,
          startDate: new Date(startDate.replace(/-/g, '/')),
          endDate: new Date(endDate.replace(/-/g, '/')),
          year: year,
        })
      }}
      className='flex flex-col justify-center items-center gap-2'
    >
      <h1 className='font-bold text-xl'>Create New Session</h1>
      <label htmlFor='name'>Session Name</label>
      <input className='text-neutral-800' name='name' onChange={(e) => setSessionName(e.target.value)} />
      <label htmlFor='year'>Year</label>
      <input className='text-neutral-800' type='number' name='year' onChange={(e) => setYear(Number(e.target.value))} />
      <label htmlFor='startDate'>Start Date</label>
      <input className='text-neutral-800' type='date' name='startDate' onChange={(e) => setStartDate(e.target.value)} />
      <label htmlFor='endDate'>End Date</label>
      <input className='text-neutral-800' type='date' name='endDate' onChange={(e) => setEndDate(e.target.value)} />
      <button className='p-2 mt-2 rounded-lg bg-green-700 hover:scale-95 transition duration-150 ease-in-out shadow-md shadow-black' type='submit'>Create New Session</button>
    </form>
  )
}

export default NewSessionForm
