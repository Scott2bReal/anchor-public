import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useOnClickOutside } from "usehooks-ts";
import { trpc } from "../utils/trpc";
import { InlineEditButtons } from "./InlineEditButtons";

type ClimberEditEmailProps = {
  climberId: string;
  originalEmail: string;
  onRequestClose: () => void;
}

export const ClimberEditEmail = ({ climberId, originalEmail, onRequestClose }: ClimberEditEmailProps) => {
  const [newEmail, setNewEmail] = useState(originalEmail)
  const ctx = trpc.useContext()

  const formRef = useRef(null)
  useOnClickOutside(formRef, () => onRequestClose())

  const updateEmail = trpc.climber.updateParentEmail.useMutation({
    onMutate: async () => {
      await ctx.climber.getById.cancel()
    },
    onSettled: () => {
      ctx.climber.getById.invalidate()
    },
    onSuccess: () => {
      toast.success('Updated climber\' parent email')
      onRequestClose()
    },
    onError: (e) => {
      toast.error(`Error updating name: ${e.message}`)
    }
  })

  return (
    <div className='flex gap-2 justify-center items-center p-2'>
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
          className='text-slate-900 px-2 rounded-lg'
        />
        <InlineEditButtons onRequestClose={onRequestClose} />
      </form>
    </div>
  )
}
