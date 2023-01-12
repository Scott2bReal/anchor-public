import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useOnClickOutside } from "usehooks-ts";
import { trpc } from "../utils/trpc";
import { InlineEditButtons } from "./InlineEditButtons";

type ClimberEditNameProps = {
  climberId: string;
  climberName: string;
  onRequestClose: () => void;
}

export const ClimberEditName = ({ climberId, climberName, onRequestClose }: ClimberEditNameProps) => {
  const [newName, setNewName] = useState(climberName)
  const ctx = trpc.useContext()

  const formRef = useRef(null)
  useOnClickOutside(formRef, () => onRequestClose())

  const updateName = trpc.climber.updateName.useMutation({
    onMutate: async () => {
      await ctx.climber.getById.cancel()
    },
    onSettled: () => {
      ctx.climber.getById.invalidate()
    },
    onSuccess: () => {
      toast.success('Updated climber name')
      onRequestClose()
    },
    onError: (e) => {
      toast.error(`Error updating name: ${e.message}`)
    }
  })

  return (
    <>
      <label htmlFor='climberName' className='text-2xl font-bold'>Edit name for {climberName}</label>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          updateName.mutate({
            climberId: climberId,
            name: newName,
          })
        }}
        className='flex gap-2 justify-center items-center p-2'
        ref={formRef}
      >
        <input
          onChange={(e) => {
            setNewName(e.target.value)
          }}
          className='text-slate-900 px-2 rounded-lg'
          autoFocus
          placeholder={climberName}
          name='climberName'
        />
        <InlineEditButtons onRequestClose={onRequestClose} />
      </form>
    </>
  )
}
