import { Switch } from '@headlessui/react'
import { User } from '@prisma/client'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { trpc } from '../utils/trpc'

interface Props {
  user: User
}

export const UserShowCampToggle = ({ user }: Props) => {
  const ctx = trpc.useContext()
  const [showCampPref, setShowCampPref] = useState(user.showCamp)

  const setUserShowCampPref = trpc.user.setShowCampPref.useMutation({
    onMutate: async () => {
      toast.loading(`Setting preferences...`)
      await ctx.user.getCurrent.cancel()
    },
    onSettled: () => {
      ctx.user.getCurrent.invalidate()
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success(`Changed your preferences`)
    },
    onError: (e) => {
      toast.dismiss()
      toast.error(`Unable to change preferences: ${e.message}`)
    },
  })

  const toggleShowCampPref = () => {
    setUserShowCampPref.mutate({
      userId: user.id,
      showCamp: !showCampPref,
    })
  }

  return (
    <>
      <Switch.Group>
        <Switch
          checked={showCampPref}
          onChange={setShowCampPref}
          onClick={() => toggleShowCampPref()}
          name='priority'
          className='relative inline-flex h-6 w-11 items-center rounded-full
        ui-checked:bg-sky-800 ui-not-checked:bg-neutral-300'
        >
          <span className='sr-only'>Show All</span>
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-150 ease-in-out ${
              showCampPref ? 'translate-x-6' : 'translate-x-1'
            }`}
          ></span>
        </Switch>
      </Switch.Group>
    </>
  )
}
