import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useOnClickOutside } from "usehooks-ts";
import { formatDateFromInput } from "../utils/formatDateFromInput";
import { trpc } from "../utils/trpc";
import { InlineEditButtons } from "./InlineEditButtons";

type SessionEditDateProps = {
  sessionId: string;
  startOrEnd: string;
  originalDate: Date;
  onRequestClose: () => void;
}

export const SessionEditDate = ({sessionId, startOrEnd, originalDate, onRequestClose}: SessionEditDateProps) => {
  const [date, setDate] = useState(originalDate)
  const ctx = trpc.useContext()

  const editStartDate = trpc.climbingSession.updateStartDate.useMutation({
    onMutate: async () => {
      await ctx.climbingSession.getAll.cancel()
    },
    onSettled: () => {
      ctx.climbingSession.getAll.invalidate()
    },
    onSuccess: () => toast.success("Updated start date! Refresh the page to see changes until I figure out how to get them to show up 😅"),
    onError: (e) => toast.error(`Unable to edit start date: ${e.message}`)
  })

  const editEndDate = trpc.climbingSession.updateEndDate.useMutation({
    onMutate: async () => {
      await ctx.climbingSession.getAll.cancel()
    },
    onSettled: () => {
      ctx.climbingSession.getAll.invalidate()
    },
    onSuccess: () => toast.success("Updated end date! Refresh the page to see changes until I figure out how to get them to show up 😅", {
      duration: 5000,
    }),
    onError: (e) => toast.error(`Unable to edit end date: ${e.message}`)
  })

  const editDate = startOrEnd === 'start' ? editStartDate : editEndDate;

  const formRef = useRef(null)
  useOnClickOutside(formRef, () => onRequestClose())

  return (
    <>
      <label htmlFor='sessionDate' className='font-bold'>Edit Expiration</label>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          editDate.mutate({
            id: sessionId,
            date: date,
          })
          onRequestClose()
        }}
        className='inline p-2'
        name='sessionDate'
        ref={formRef}
      >
        <input
          type='date'
          onChange={(e) => setDate(formatDateFromInput(e.target.value))}
          className='text-neutral-900 px-2 py-1 rounded-lg'
        />
      <InlineEditButtons onRequestClose={onRequestClose} />
      </form>
    </>

  )
}
