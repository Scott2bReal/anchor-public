import { useRef, useState } from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import { useEditClimberName } from '../hooks/climber/useEditClimberName'
import { InlineEditButtons } from './InlineEditButtons'

type ClimberEditNameProps = {
  climberId: string
  climberName: string
  onRequestClose: () => void
}

export const ClimberEditName = ({
  climberId,
  climberName,
  onRequestClose,
}: ClimberEditNameProps) => {
  const [newName, setNewName] = useState(climberName)

  const formRef = useRef(null)
  useOnClickOutside(formRef, () => onRequestClose())

  const updateName = useEditClimberName(onRequestClose)

  return (
    <>
      <label htmlFor='climberName' className='text-2xl font-bold'>
        Edit name for {climberName}
      </label>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          updateName.mutate({
            climberId: climberId,
            name: newName,
          })
        }}
        className='flex items-center justify-center gap-2 p-2'
        ref={formRef}
      >
        <input
          onChange={(e) => {
            setNewName(e.target.value)
          }}
          className='rounded-lg px-2 text-slate-900'
          autoFocus
          placeholder={climberName}
          name='climberName'
        />
        <InlineEditButtons onRequestClose={onRequestClose} />
      </form>
    </>
  )
}
