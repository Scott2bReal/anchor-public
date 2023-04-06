import { useRef, useState } from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import { useClimberUpdateEmail } from '../hooks/waitlist-hooks/useClimberUpdateEmail'
import { InlineEditButtons } from './InlineEditButtons'

type ClimberEditEmailProps = {
  climberId: string
  originalEmail: string
  onRequestClose: () => void
}

export const ClimberEditEmail = ({
  climberId,
  originalEmail,
  onRequestClose,
}: ClimberEditEmailProps) => {
  const [newEmail, setNewEmail] = useState(originalEmail)
  const formRef = useRef(null)
  useOnClickOutside(formRef, () => onRequestClose())

  const updateEmail = useClimberUpdateEmail(onRequestClose)

  return (
    <div className='flex items-center justify-center gap-2 p-2'>
      <h1 className='text-2xl font-bold'>Edit Parent Email</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          updateEmail.mutate({
            climberId: climberId,
            parentEmail: newEmail,
          })
        }}
        ref={formRef}
      >
        <input
          onChange={(e) => {
            setNewEmail(e.target.value)
          }}
          placeholder={originalEmail}
          autoFocus
          className='rounded-lg px-2 text-slate-900'
        />
        <InlineEditButtons onRequestClose={onRequestClose} />
      </form>
    </div>
  )
}
