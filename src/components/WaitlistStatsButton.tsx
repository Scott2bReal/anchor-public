import { DocumentChartBarIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface WaitlistStatsButton {
  toggleStatsOpen: () => void;
}

const WaitlistStatsButton = ({ toggleStatsOpen }: WaitlistStatsButton) => {
  const [hovered, setHovered] = useState(false)

  return (
    <>
      <button
        onClick={() => toggleStatsOpen()}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className='border-[1px] border-white rounded-lg p-2 hover:scale-95 duration-150 ease-in-out transition z-[2]'
      >
        <DocumentChartBarIcon className='h-4 w-4' />

      </button>
      <span className={`${hovered ? 'translate-x-[40px] opacity-100' : 'opacity-0'} w-max absolute left-[80px] text-neutral-400 transition duration-300 ease-in-out hover:cursor-default`}>View Waitlist Stats</span>
    </>
  )
}

export default WaitlistStatsButton
