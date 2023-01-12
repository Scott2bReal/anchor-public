import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useOnClickOutside } from "usehooks-ts";
import { parseTimeInput } from "../utils/parseTimeInput";
import setDuration from "../utils/setDuration";
import { trpc } from "../utils/trpc";
import { InlineEditButtons } from "./InlineEditButtons";

type ClassEditTimeProps = {
  classId: string;
  classType: string;
  originalTime: Date;
  onRequestClose: () => void;
}

export const ClassEditTime = ({ classId, classType, originalTime, onRequestClose }: ClassEditTimeProps) => {
  const [newTime, setNewTime] = useState(originalTime.toLocaleTimeString())
  const ctx = trpc.useContext()

  const formRef = useRef(null)
  useOnClickOutside(formRef, () => onRequestClose())

  const editTime = trpc.climbingClass.updateTime.useMutation({
    onMutate: async () => {
      ctx.gyms.getForClassInfo.cancel();
      ctx.gyms.getById.cancel();
    },
    onSettled: () => {
      ctx.gyms.getForClassInfo.invalidate();
      ctx.gyms.getById.invalidate();
    },
    onSuccess: () => {
      toast.success("Start time updated")
      onRequestClose()
    },
    onError: (e) => {
      toast.error(`Error updating start time: ${e.message}`)
    }
  })

  return (
    <>
      <h1 className='font-bold'>Edit Class Start Time</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          editTime.mutate({
            classId: classId,
            startTime: parseTimeInput(newTime),
            endTime: setDuration({classType: classType, startTime: parseTimeInput(newTime)})
          })
        }}
          className='flex gap-2 items-center justify-start'
          ref={formRef}
      >
        <input
          onChange={(e) => {
            setNewTime(e.target.value)
          }}
          type='time'
          autoFocus
          className='text-slate-900 px-2 rounded-lg shadow-md shadow-neutral-900'
        />
        <InlineEditButtons onRequestClose={onRequestClose} />
      </form>
    </>
  )
}
