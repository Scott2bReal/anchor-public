import { Switch } from '@headlessui/react'
import type { User } from '@prisma/client'
import { useState } from 'react'
import { useSetUserCampToggle } from '../hooks/user/useSetUserCamptoggle'

interface Props {
  user: User
}

export const UserShowCampToggle = ({ user }: Props) => {
  const [showCampPref, setShowCampPref] = useState(user.showCamp)
  const setUserShowCampPref = useSetUserCampToggle()

  const toggleShowCampPref = () => {
    setUserShowCampPref.mutate({
      userId: user.id,
      showCamp: !showCampPref,
    })
    setShowCampPref(!showCampPref)
  }

  return (
    <>
      <Switch.Group>
        <Switch
          checked={showCampPref}
          onChange={toggleShowCampPref}
          name='priority'
          className='relative inline-flex h-6 w-11 items-center rounded-full
        ui-checked:bg-green-700 ui-not-checked:bg-neutral-300'
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
