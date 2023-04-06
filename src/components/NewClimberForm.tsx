import { XMarkIcon } from '@heroicons/react/24/solid'
import { useAtom } from 'jotai'
import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { api } from '../utils/api'
import { climberAtom } from '../utils/atoms/climberAtom'
import capitalize from '../utils/capitalize'

type NewClimberProps = {
  query: string
  setQuery: Dispatch<SetStateAction<string | null>>
  onRequestClose: () => void
}

const NewClimberForm = ({
  query,
  setQuery,
  onRequestClose,
}: NewClimberProps) => {
  const [climberName, setName] = useState(capitalize(query))
  const [email, setEmail] = useState('')
  const [, setSelectedClimber] = useAtom(climberAtom)

  const addNewClimber = api.climber.createClimber.useMutation({
    onMutate: () => {
      toast.loading('Adding climber...')
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(`Couldn't create climber: ${e.message}`)
    },
    onSuccess: (data) => {
      toast.dismiss()
      toast.success(`Climber was added to the database!`)
      if (!data) return
      setSelectedClimber(data.id)
      setQuery(data.name)
      onRequestClose()
    },
  })

  // If form is displayed, user doesn't want a query yet

  return (
    <div className='p-4'>
      <form
        className='flex flex-col items-center justify-center gap-2'
        onSubmit={(e) => {
          e.preventDefault()

          addNewClimber.mutate({
            name: climberName,
            parentEmail: email,
          })
        }}
      >
        <div className='flex items-center justify-center gap-2'>
          <h2 className='text-lg font-bold'>Add New Climber</h2>
          <button onClick={() => onRequestClose()}>
            <XMarkIcon className='h-6 w-6 text-red-700 hover:opacity-75' />
          </button>
        </div>
        <label htmlFor='climberName'>Name</label>
        <input
          className='rounded-lg px-1 text-slate-900 shadow-md shadow-neutral-900'
          value={climberName}
          name='climberName'
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor='email'>Parent Email</label>
        <input
          className='rounded-lg px-1 text-slate-900 shadow-md shadow-neutral-900'
          type='email'
          name='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type='submit'
          className='rounded-lg bg-gray-700 p-2 shadow-md shadow-neutral-900 hover:scale-105'
        >
          Add Climber
        </button>
      </form>
    </div>
  )
}

export default NewClimberForm
