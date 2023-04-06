import { useState } from 'react'
import { useSessionCreate } from '../hooks/waitlist-hooks/useSessionCreate'

type NewSessionFormProps = {
  onRequestClose: () => void
}

const NewSessionForm = ({ onRequestClose }: NewSessionFormProps) => {
  // Form states
  const [year, setYear] = useState(2022)
  const [sessionName, setSessionName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const createSession = useSessionCreate(onRequestClose)

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
      className='flex flex-col items-center justify-center gap-2'
    >
      <h1 className='text-xl font-bold'>Create New Session</h1>
      <label htmlFor='name'>Session Name</label>
      <input
        className='text-neutral-800'
        name='name'
        onChange={(e) => setSessionName(e.target.value)}
      />
      <label htmlFor='year'>Year</label>
      <input
        className='text-neutral-800'
        type='number'
        name='year'
        onChange={(e) => setYear(Number(e.target.value))}
      />
      <label htmlFor='startDate'>Start Date</label>
      <input
        className='text-neutral-800'
        type='date'
        name='startDate'
        onChange={(e) => setStartDate(e.target.value)}
      />
      <label htmlFor='endDate'>End Date</label>
      <input
        className='text-neutral-800'
        type='date'
        name='endDate'
        onChange={(e) => setEndDate(e.target.value)}
      />
      <button
        className='mt-2 rounded-lg bg-green-700 p-2 shadow-md shadow-black transition duration-150 ease-in-out hover:scale-95'
        type='submit'
      >
        Create New Session
      </button>
    </form>
  )
}

export default NewSessionForm
