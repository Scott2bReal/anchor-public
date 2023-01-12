import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useOnClickOutside } from "usehooks-ts";
import { trpc } from "../utils/trpc";
import { InlineEditButtons } from "./InlineEditButtons";

type InstructorEditProps = {
  classId: string,
  originalInstructor: string,
  onRequestClose: () => void;
}

const InstructorEdit = ({ classId, originalInstructor, onRequestClose }: InstructorEditProps) => {
  const [instructor, setInstructor] = useState(originalInstructor)
  const ctx = trpc.useContext()

  const formRef = useRef(null)
  useOnClickOutside(formRef, () => onRequestClose())

  const updateInstructor = trpc.climbingClass.updateInstructor.useMutation({
    onMutate: async () => {
      await ctx.climbingClass.getClassInfo.cancel()
      await ctx.gyms.getById.cancel()
    },
    onSettled: () => {
      ctx.climbingClass.getClassInfo.invalidate()
      ctx.gyms.getById.invalidate()
    },
    onSuccess: () => {
      toast.success('Updated instructor')
    },
    onError: (e) => {
      toast.error(`Error updating instructor: ${e.message}`)
    }
  })

  return (
    <form
      className='flex items-center gap-2'
      onSubmit={(e) => {
        e.preventDefault()
        updateInstructor.mutate({
          classId: classId,
          instructor: instructor,
        })
        onRequestClose()
      }}
      ref={formRef}
    >
      <input
        onChange={(e) => setInstructor(e.target.value)}
        placeholder={originalInstructor}
        className='text-neutral-900 rounded-lg px-1 shadow-md shadow-neutral-900'
        autoFocus
      />
      <InlineEditButtons onRequestClose={onRequestClose} />
    </form>
  )
}

export default InstructorEdit
