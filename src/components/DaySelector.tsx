import { Switch } from '@headlessui/react'
import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'

const DaySelector = () => {
  const [monday, setMonday] = useState(false)
  const [tuesday, setTuesday] = useState(false)
  const [wednesday, setWednesday] = useState(false)
  const [thursday, setThursday] = useState(false)
  const [friday, setFriday] = useState(false)
  const [saturday, setSaturday] = useState(false)
  const [sunday, setSunday] = useState(false)

  const days: {
    [idx: string]: { state: boolean; setter: Dispatch<SetStateAction<boolean>> }
  } = {
    Monday: { state: monday, setter: setMonday },
    Tuesday: { state: tuesday, setter: setTuesday },
    Wednesday: { state: wednesday, setter: setWednesday },
    Thursday: { state: thursday, setter: setThursday },
    Friday: { state: friday, setter: setFriday },
    Saturday: { state: saturday, setter: setSaturday },
    Sunday: { state: sunday, setter: setSunday },
  }

  return (
    <div className='flex flex-col items-center justify-center gap-2'>
      <div className='flex items-center justify-center gap-2'>
        <h2 className='text-lg font-bold'>Availability</h2>
      </div>
      <div className='flex items-center justify-center gap-2'>
        {Object.keys(days).map((day) => {
          return (
            <Switch
              key={day}
              checked={days[day]?.state}
              onChange={days[day]?.setter}
              className='rounded-lg bg-gray-800 p-2 transition duration-150 ease-in-out hover:bg-gray-500 ui-checked:bg-gray-500'
            >
              {day}
            </Switch>
          )
        })}
      </div>
    </div>
  )
}

export default DaySelector
