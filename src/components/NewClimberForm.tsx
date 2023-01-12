import { XMarkIcon } from "@heroicons/react/24/solid"
import { useAtom } from "jotai"
import { Dispatch, SetStateAction, useState } from "react"
import toast from "react-hot-toast"
import { climberAtom } from "../utils/atoms/climberAtom"
import { trpc } from "../utils/trpc"

type NewClimberProps = {
  query: string;
  setQuery: Dispatch<SetStateAction<string| null>>;
  onRequestClose: () => void;
}

const NewClimberForm = ({ query, setQuery, onRequestClose }: NewClimberProps) => {
  const [climberName, setName] = useState(query)
  const [email, setEmail] = useState('')
  const [, setSelectedClimber] = useAtom(climberAtom)

  const addNewClimber = trpc.climber.createClimber.useMutation({
    onMutate: () => {
      toast.loading('Adding climber...')
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(`Couldn't create climber: ${e.data?.zodError?.fieldErrors['parentEmail'] ?? e.message}`)
    },
    onSuccess: (data) => {
      toast.dismiss()
      toast.success(`Climber was added to the database!`)
      if (!data) return
      setSelectedClimber(data.id)
      setQuery(data.name)
      onRequestClose()
    }
  })

  // If form is displayed, user doesn't want a query yet

  return (
    <div className='p-4'>
      <form
        className='flex flex-col justify-center items-center gap-2'
        onSubmit={(e) => {
          e.preventDefault()

          addNewClimber.mutate({
            name: climberName,
            parentEmail: email,
          }
          )
        }}
      >
        <div className='flex justify-center items-center gap-2'>
          <h2 className="text-lg font-bold">Add New Climber</h2>
          <button
            onClick={() => onRequestClose()}
          >
            <XMarkIcon className='h-6 w-6 hover:opacity-75 text-red-700' />
          </button>
        </div>
        <label htmlFor='climberName'>Name</label>
        <input
          className="text-slate-900 rounded-lg shadow-md shadow-neutral-900 px-1"
          value={climberName}
          name='climberName'
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor='email'>Parent Email</label>
        <input
          className="text-slate-900 rounded-lg shadow-md shadow-neutral-900 px-1"
          type='email'
          name='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type='submit'
          className='p-2 rounded-lg bg-gray-700 hover:scale-105 shadow-md shadow-neutral-900'
        >Add Climber</button>
      </form>
    </div >
  )
}

export default NewClimberForm
