import { Listbox, Transition } from '@headlessui/react'
import { ChevronDoubleRightIcon } from '@heroicons/react/24/solid'
import { useAtom } from 'jotai'
import { gymAtom } from '../utils/atoms/gymAtom'

type GymSelectorProps = {
  gyms: { id: string; name: string; cssCode: string }[]
  selectedGym: { name: string; cssCode: string }
}

export const GymSelector = ({ gyms, selectedGym }: GymSelectorProps) => {
  const [selectedGymId, setSelectedGymId] = useAtom(gymAtom)

  if (!gyms || !selectedGym) return <div>No gyms found!</div>

  return (
    <Listbox value={selectedGymId} onChange={setSelectedGymId} horizontal>
      <div className='relative mt-1 flex h-max items-center p-2'>
        <Listbox.Button
          className={`shadow-md shadow-neutral-900 ${selectedGym.cssCode} mr-4 flex items-center gap-2 rounded-lg p-2 text-lg transition-colors duration-500 ease-in-out hover:scale-105`}
        >
          <>
            {selectedGym.name}
            <ChevronDoubleRightIcon className='h-4 w-4' />
          </>
        </Listbox.Button>
        <Transition
          enter='transition duration-100 ease-out'
          enterFrom='transform scale-95 opacity-0'
          enterTo='transform scale-100 opacity-100'
          leave='transition duration-75 ease-out'
          leaveFrom='transform scale-100 opacity-100'
          leaveTo='transform scale-95 opacity-0'
        >
          <Listbox.Options className='flex gap-1'>
            {gyms.map((gym) => (
              <Listbox.Option
                className={`${gym.cssCode} box-border rounded-lg p-2 shadow-md shadow-neutral-900 transition duration-150 ease-in-out hover:scale-95 hover:cursor-pointer`}
                key={gym.id}
                value={gym.id}
              >
                {gym.name}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}
