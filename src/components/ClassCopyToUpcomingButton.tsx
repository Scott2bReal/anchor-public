import { CalendarIcon, ForwardIcon } from '@heroicons/react/24/outline'
import type { ClimbingClass } from '@prisma/client'
import { useState } from 'react'
import { useCopyClassToUpcomingSession } from '../hooks/climbing-class/useCopyClassToUpcomingSession'

interface Props {
  climbingClass: ClimbingClass
}

export const ClassCopyToUpcomingButton = ({ climbingClass }: Props) => {
  const copyToUpcoming = useCopyClassToUpcomingSession()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      className='h-6 w-6 transition duration-150 ease-in-out hover:opacity-75'
      onClick={() => copyToUpcoming.mutate({ classId: climbingClass.id })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className='relative flex flex-col'>
        <span
          className={`${
            isHovered ? '-translate-y-6 opacity-100' : ''
          } } absolute -left-2 top-0 text-sm opacity-0 transition duration-150 ease-in-out`}
        >
          Copy
        </span>
        <CalendarIcon className='h-4 w-4' />
        <ForwardIcon className='h-4 w-4' />
      </div>
    </button>
  )
}
