import { DocumentChartBarIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

interface WaitlistStatsButton {
  toggleStatsOpen: () => void
}

const WaitlistStatsButton = ({ toggleStatsOpen }: WaitlistStatsButton) => {
  const [hovered, setHovered] = useState(false)

  return (
    <>
      <button
        onClick={() => toggleStatsOpen()}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className='z-[2] rounded-lg border-[1px] border-white p-2 transition duration-150 ease-in-out hover:scale-95'
      >
        <DocumentChartBarIcon className='h-4 w-4' />
      </button>
      <span
        className={`${
          hovered ? 'translate-x-[40px] opacity-100' : 'opacity-0'
        } absolute left-[80px] w-max text-neutral-400 transition duration-300 ease-in-out hover:cursor-default`}
      >
        View Waitlist Stats
      </span>
    </>
  )
}

export default WaitlistStatsButton
