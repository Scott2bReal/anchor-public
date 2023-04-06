import type { User } from '@prisma/client'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { api } from '../utils/api'

interface Props {
  currentId: string
  user: User
}

export const UserAutoDefaultSessionButton = ({ currentId, user }: Props) => {
  const ctx = api.useContext()
  const router = useRouter()
  const handleSetSession = async () => {
    await router.push('/schedule')
  }
  const [clicked, setClicked] = useState(false)
  const setUserDefault = api.user.setDefaultSession.useMutation({
    onMutate: async () => {
      toast.loading(`Setting your default session`)
      await ctx.climbingSession.getAll.cancel()
    },
    onSettled: async () => {
      await ctx.climbingSession.getAll.invalidate()
    },
    onSuccess: async () => {
      toast.dismiss()
      toast.success(`Set your default session as the current session`)
      await handleSetSession()
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(
        `There was an error setting your default session: ${e.message}`
      )
    },
  })

  return (
    <button
      className={`${
        clicked ? 'scale-95' : ''
      } rounded-lg bg-slate-900 p-2 shadow-md shadow-neutral-900`}
      onMouseDown={() => setClicked(true)}
      onMouseUp={() => setClicked(false)}
      onClick={() =>
        setUserDefault.mutate({
          userId: user.id,
          sessionId: currentId,
        })
      }
    >
      Click here to start
    </button>
  )
}
