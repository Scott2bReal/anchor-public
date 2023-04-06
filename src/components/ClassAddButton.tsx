import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

interface ClassAddButtonProps {
  toggleFunction: () => void
}

const ClassAddButton = ({ toggleFunction }: ClassAddButtonProps) => {
  const [hovered, setHovered] = useState(false)

  return (
    <>
      <button
        onClick={() => toggleFunction()}
        className='z-[2] flex gap-2'
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <PlusCircleIcon className='z-[2] h-8 w-8 transition duration-300 ease-in-out hover:rotate-90' />
      </button>
      <span
        className={`${
          hovered ? 'translate-x-[40px] opacity-100' : 'opacity-0'
        } absolute left-[80px] w-max text-neutral-400 transition duration-300 ease-in-out hover:cursor-default`}
      >
        Add a class to the schedule
      </span>
    </>
  )
}

export default ClassAddButton
