import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface Props {
  toggleFunction: () => void;
}

export const CampAddWeekButton = ({ toggleFunction }: Props) => {
  const [hovered, setHovered] = useState(false)

  return (
    <>
      <button
        onClick={() => toggleFunction()}
        className='flex gap-2 z-[2]'
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <PlusCircleIcon className='z-[2] h-8 w-8 hover:rotate-90 transition duration-300 ease-in-out' />

      </button>
      <span className={`${hovered ? 'translate-x-[40px] opacity-100' : 'opacity-0'} w-max absolute left-[80px] text-neutral-400 transition duration-300 ease-in-out hover:cursor-default`}>Add a camp week to the schedule</span>
    </>
  )
}
