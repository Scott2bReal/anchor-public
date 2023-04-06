import { useState } from 'react'
import { useCampCreateNewYear } from '../hooks/camp/useCampCreateNewYear'

interface Props {
  onRequestClose: () => void
  selectedYear: number
}
export const CampNewYearForm = ({ onRequestClose, selectedYear }: Props) => {
  const [newYear, setNewYear] = useState(selectedYear + 1)
  const createNewYear = useCampCreateNewYear(onRequestClose)

  return (
    <form
      className={`flex flex-col items-center justify-center gap-4`}
      onSubmit={(e) => {
        e.preventDefault()
        createNewYear.mutate({
          year: newYear,
        })
      }}
    >
      <label className={`text-lg font-bold`} htmlFor='newYear'>
        New Year
      </label>
      <input
        className={`rounded-lg p-1 text-neutral-900`}
        type='number'
        min={selectedYear + 1}
        value={newYear}
        onChange={(e) => setNewYear(Number(e.target.value))}
      />
      <button
        type='submit'
        className={`mx-auto rounded-lg bg-green-800 p-2 shadow-md shadow-neutral-900 transition duration-150 ease-in-out hover:scale-95`}
      >
        Submit
      </button>
    </form>
  )
}
