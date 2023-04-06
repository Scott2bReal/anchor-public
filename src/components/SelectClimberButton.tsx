import type { Climber } from '@prisma/client'
import { useAtom } from 'jotai'
import toast from 'react-hot-toast'
import { climberAtom } from '../utils/atoms/climberAtom'

type SelectClimberButtonProps = {
  climber: Climber
}

const SelectClimberButton = ({ climber }: SelectClimberButtonProps) => {
  const [, setSelectedClimberId] = useAtom(climberAtom)

  return (
    <button
      className='rounded-lg bg-gray-800 p-2 shadow-md shadow-neutral-900 transition duration-150 hover:scale-95'
      onClick={() => {
        setSelectedClimberId(climber.id)
        toast.success(`Selected ${climber.name}`)
      }}
    >
      Select this climber!
    </button>
  )
}

export default SelectClimberButton
